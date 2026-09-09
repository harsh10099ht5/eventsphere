const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { pool, testConnection } = require("./db");

const app = express();


// ============================================================
// CONFIGURATION
// ============================================================

const PORT = process.env.PORT || 5000;

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ||
  "http://127.0.0.1:5001";


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());


// ============================================================
// DATABASE
// ============================================================

testConnection();


// ============================================================
// ROOT
// ============================================================

app.get("/", (req, res) => {
  res.json({
    service: "EventSphere Backend API",
    status: "active",
    version: "3.0.0",
    database: "MySQL",
    ml_service: ML_SERVICE_URL,
  });
});


// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "healthy",
      backend: "active",
      database: "connected",
      ml_service: ML_SERVICE_URL,
    });

  } catch (error) {
    console.error("HEALTH CHECK ERROR:", error);

    res.status(500).json({
      status: "unhealthy",
      backend: "active",
      database: "disconnected",
      error: error.message,
    });
  }
});


// ============================================================
// GET ALL EVENTS
// ============================================================

app.get("/api/events", async (req, res) => {
  try {

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        event_date,
        event_time,
        venue,
        category,
        skills,
        created_at
      FROM events
      ORDER BY event_date ASC
      `
    );

    res.json(rows);

  } catch (error) {

    console.error(
      "GET EVENTS ERROR:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});


// ============================================================
// GET SINGLE EVENT
// ============================================================

app.get("/api/events/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid event ID",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        event_date,
        event_time,
        venue,
        category,
        skills,
        created_at
      FROM events
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    res.json(rows[0]);

  } catch (error) {

    console.error(
      "GET EVENT ERROR:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to fetch event",
      error: error.message,
    });
  }
});


// ============================================================
// AI EVENT RECOMMENDATION
// ============================================================

app.post("/api/recommend", async (req, res) => {

  try {

    console.log("\n");
    console.log(
      "============================================================"
    );
    console.log(
      "AI RECOMMENDATION REQUEST"
    );
    console.log(
      "============================================================"
    );


    // --------------------------------------------------------
    // INPUT
    // --------------------------------------------------------

    const {
      interest,
      category = null,
      skills = [],
      top_n = 5,
      user_id = null,
    } = req.body;


    console.log(
      "Interest:",
      interest
    );

    console.log(
      "Category:",
      category
    );

    console.log(
      "Skills:",
      skills
    );

    console.log(
      "User ID:",
      user_id
    );


    // --------------------------------------------------------
    // VALIDATE INTEREST
    // --------------------------------------------------------

    if (
      !interest ||
      typeof interest !== "string" ||
      !interest.trim()
    ) {

      return res.status(400).json({
        status: "error",
        message: "Interest is required",
      });
    }


    // --------------------------------------------------------
    // NORMALIZE SKILLS
    // --------------------------------------------------------

    const normalizedSkills =
      Array.isArray(skills)
        ? skills
            .filter(
              (skill) =>
                typeof skill === "string"
            )
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean)
        : [];


    // --------------------------------------------------------
    // VALIDATE TOP N
    // --------------------------------------------------------

    const requestedTopN =
      Number(top_n);

    const safeTopN =
      Number.isInteger(requestedTopN) &&
      requestedTopN > 0 &&
      requestedTopN <= 20
        ? requestedTopN
        : 5;


    // --------------------------------------------------------
    // FETCH EVENTS
    // --------------------------------------------------------

    const [events] = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        event_date,
        event_time,
        venue,
        category,
        skills
      FROM events
      ORDER BY event_date ASC
      `
    );


    console.log(
      "Events fetched from MySQL:",
      events.length
    );


    if (
      !events ||
      events.length === 0
    ) {

      return res.status(404).json({
        status: "error",
        message:
          "No events available for recommendation",
      });
    }


    // --------------------------------------------------------
    // GET USER HISTORY
    // --------------------------------------------------------

    let history = [];

    if (user_id) {

      try {

        const [historyRows] =
          await pool.query(
            `
            SELECT
              event_id,
              interaction_type,
              interaction_score,
              created_at
            FROM user_event_interactions
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 100
            `,
            [user_id]
          );

        history = historyRows;

        console.log(
          "User interaction history:",
          history.length
        );

      } catch (historyError) {

        console.warn(
          "Could not load user history:",
          historyError.message
        );

      }
    }


    // --------------------------------------------------------
    // PREPARE EVENTS FOR PYTHON
    // --------------------------------------------------------

    const mlEvents =
      events.map((event) => ({

        id: event.id,

        title:
          event.title || "",

        description:
          event.description || "",

        category:
          event.category ||
          "General",

        skills:
          event.skills || "",

        event_date:
          event.event_date ||
          null,

        event_time:
          event.event_time ||
          null,

        venue:
          event.venue ||
          "",

      }));


    // --------------------------------------------------------
    // PYTHON ML REQUEST
    // --------------------------------------------------------

    console.log(
      "Sending",
      mlEvents.length,
      "events to Python ML"
    );


    const mlResponse =
      await fetch(
        `${ML_SERVICE_URL}/recommend`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            interest:
              interest.trim(),

            category:
              category || null,

            skills:
              normalizedSkills,

            top_n:
              safeTopN,

            events:
              mlEvents,

            history:
              history,

          }),
        }
      );


    // --------------------------------------------------------
    // PYTHON ERROR
    // --------------------------------------------------------

    if (!mlResponse.ok) {

      const errorText =
        await mlResponse.text();

      console.error(
        "Python ML ERROR:",
        errorText
      );

      return res.status(
        mlResponse.status
      ).json({

        status: "error",

        message:
          "Python ML recommendation failed.",

        details:
          errorText,

      });
    }


    // --------------------------------------------------------
    // PYTHON RESPONSE
    // --------------------------------------------------------

    const mlData =
      await mlResponse.json();


    console.log(
      "Recommendations returned:",
      mlData.recommendations?.length ||
        0
    );


    // --------------------------------------------------------
    // FINAL RESPONSE
    // --------------------------------------------------------

    return res.json({

      status: "success",

      source: {

        database:
          "MySQL",

        ml_engine:
          "Python",

      },

      input: {

        interest:
          interest.trim(),

        category:
          category || null,

        skills:
          normalizedSkills,

        user_id:
          user_id,

      },

      events_analyzed:
        mlEvents.length,

      user_history_count:
        history.length,

      recommendations:
        mlData.recommendations ||
        [],

      model:
        mlData.model || {

          algorithm:
            "TF-IDF + Cosine Similarity",

        },

    });

  } catch (error) {

    console.error(
      "RECOMMENDATION ERROR:",
      error
    );


    // Python unavailable
    if (
      error.code ===
        "ECONNREFUSED" ||
      error.cause?.code ===
        "ECONNREFUSED"
    ) {

      return res.status(503).json({

        status: "error",

        message:
          "Python ML service is not running.",

        service:
          ML_SERVICE_URL,

      });
    }


    return res.status(500).json({

      status: "error",

      message:
        "Failed to generate recommendations.",

      error:
        error.message,

    });
  }
});


// ============================================================
// USER EVENT INTERACTION
// ============================================================

app.post(
  "/api/interactions",
  async (req, res) => {

    try {

      console.log(
        "\n========== USER INTERACTION =========="
      );


      // ------------------------------------------------------
      // INPUT
      // ------------------------------------------------------

      const {
        user_id,
        event_id,
        interaction_type,
      } = req.body;


      console.log(
        "User:",
        user_id
      );

      console.log(
        "Event:",
        event_id
      );

      console.log(
        "Interaction:",
        interaction_type
      );


      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (
        !user_id ||
        !Number.isInteger(
          Number(user_id)
        )
      ) {

        return res.status(400).json({
          status: "error",
          message:
            "Valid user_id is required",
        });
      }


      if (
        !event_id ||
        !Number.isInteger(
          Number(event_id)
        )
      ) {

        return res.status(400).json({
          status: "error",
          message:
            "Valid event_id is required",
        });
      }


      const allowedInteractions = [
        "view",
        "bookmark",
        "register",
      ];


      if (
        !allowedInteractions.includes(
          interaction_type
        )
      ) {

        return res.status(400).json({

          status: "error",

          message:
            "Invalid interaction type. Use view, bookmark or register.",

        });
      }


      // ------------------------------------------------------
      // SCORE
      // ------------------------------------------------------

      const interactionScores = {

        view: 0.20,

        bookmark: 0.50,

        register: 1.00,

      };


      const score =
        interactionScores[
          interaction_type
        ];


      // ------------------------------------------------------
      // CHECK EVENT
      // ------------------------------------------------------

      const [events] =
        await pool.query(
          `
          SELECT id
          FROM events
          WHERE id = ?
          `,
          [event_id]
        );


      if (
        events.length === 0
      ) {

        return res.status(404).json({

          status: "error",

          message:
            "Event not found",

        });
      }


      // ------------------------------------------------------
      // SAVE INTERACTION
      // ------------------------------------------------------

      const [result] =
        await pool.query(
          `
          INSERT INTO user_event_interactions
          (
            user_id,
            event_id,
            interaction_type,
            interaction_score
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            user_id,
            event_id,
            interaction_type,
            score,
          ]
        );


      console.log(
        `Interaction saved successfully: user=${user_id}, event=${event_id}, type=${interaction_type}, score=${score}`
      );


      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      return res.status(201).json({

        status: "success",

        message:
          "User interaction recorded successfully",

        interaction: {

          id:
            result.insertId,

          user_id:
            Number(user_id),

          event_id:
            Number(event_id),

          interaction_type:
            interaction_type,

          interaction_score:
            score,

        },

      });

    } catch (error) {

      console.error(
        "INTERACTION ERROR:",
        error
      );


      return res.status(500).json({

        status: "error",

        message:
          "Failed to record user interaction",

        error:
          error.message,

      });
    }
  }
);


// ============================================================
// GET USER INTERACTION HISTORY
// ============================================================

app.get(
  "/api/interactions/:userId",
  async (req, res) => {

    try {

      const {
        userId,
      } = req.params;


      if (
        !Number.isInteger(
          Number(userId)
        )
      ) {

        return res.status(400).json({

          status: "error",

          message:
            "Invalid user ID",

        });
      }


      const [rows] =
        await pool.query(
          `
          SELECT
            uei.id,
            uei.user_id,
            uei.event_id,
            uei.interaction_type,
            uei.interaction_score,
            uei.created_at,

            e.title,
            e.category,
            e.event_date,
            e.venue

          FROM user_event_interactions uei

          INNER JOIN events e
            ON e.id = uei.event_id

          WHERE uei.user_id = ?

          ORDER BY
            uei.created_at DESC
          `,
          [userId]
        );


      res.json({

        status: "success",

        user_id:
          Number(userId),

        count:
          rows.length,

        interactions:
          rows,

      });

    } catch (error) {

      console.error(
        "GET INTERACTION HISTORY ERROR:",
        error
      );


      res.status(500).json({

        status: "error",

        message:
          "Failed to fetch interaction history",

        error:
          error.message,

      });
    }
  }
);


// ============================================================
// DELETE USER INTERACTION
// ============================================================

app.delete(
  "/api/interactions/:id",
  async (req, res) => {

    try {

      const {
        id,
      } = req.params;


      if (
        !Number.isInteger(
          Number(id)
        )
      ) {

        return res.status(400).json({

          status: "error",

          message:
            "Invalid interaction ID",

        });
      }


      const [result] =
        await pool.query(
          `
          DELETE FROM
            user_event_interactions

          WHERE id = ?
          `,
          [id]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          status: "error",

          message:
            "Interaction not found",

        });
      }


      res.json({

        status: "success",

        message:
          "Interaction deleted successfully",

      });

    } catch (error) {

      console.error(
        "DELETE INTERACTION ERROR:",
        error
      );


      res.status(500).json({

        status: "error",

        message:
          "Failed to delete interaction",

        error:
          error.message,

      });
    }
  }
);


// ============================================================
// 404 HANDLER
// ============================================================

app.use(
  (req, res) => {

    res.status(404).json({

      status: "error",

      message:
        `Route ${req.method} ${req.originalUrl} not found`,

    });

  }
);


// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );


    res.status(500).json({

      status: "error",

      message:
        "Internal server error",

      error:
        error.message,

    });

  }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "============================================================"
    );

    console.log(
      "             EVENTSPHERE BACKEND API"
    );

    console.log(
      "============================================================"
    );

    console.log(
      `Server       : http://localhost:${PORT}`
    );

    console.log(
      "Database     : MySQL"
    );

    console.log(
      `ML Service   : ${ML_SERVICE_URL}`
    );

    console.log(
      "Recommendation: /api/recommend"
    );

    console.log(
      "Interactions : /api/interactions"
    );

    console.log(
      "Events       : /api/events"
    );

    console.log(
      "============================================================"
    );

    console.log("");

  }
);