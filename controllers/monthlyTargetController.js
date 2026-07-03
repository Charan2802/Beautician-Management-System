import MonthlyTarget from "../models/MonthlyTarget.js";


/*
=================================
CREATE TARGET
=================================
*/

export const createTarget = async (req, res) => {
  try {
    const {
      targetCategory,
      targetAmount,
      actualAmount,
      month,
      year,
    } = req.body;

    const progress =
      Number(targetAmount) > 0
        ? Math.round(
            (Number(actualAmount || 0) /
              Number(targetAmount)) *
              100
          )
        : 0;

    const target =
      await MonthlyTarget.create({
        targetCategory,
        targetAmount,
        actualAmount,
        month,
        year,
        progress,
      });

    res.status(201).json({
      success: true,
      target,
    });
  } catch (error) {
    console.log(
      "CREATE TARGET ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
GET TARGETS
=================================
*/

export const getTargets = async (
  req,
  res
) => {
  try {
    const targets =
      await MonthlyTarget.find().sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      targets,
    });
  } catch (error) {
    console.log(
      "GET TARGET ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
UPDATE TARGET
=================================
*/

export const updateTarget = async (
  req,
  res
) => {
  try {
    const progress =
      Number(req.body.targetAmount) > 0
        ? Math.round(
            (Number(
              req.body.actualAmount || 0
            ) /
              Number(
                req.body.targetAmount
              )) *
              100
          )
        : 0;

    const target =
      await MonthlyTarget.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          progress,
        },
        {
          new: true,
        }
      );

    res.json({
      success: true,
      target,
    });
  } catch (error) {
    console.log(
      "UPDATE TARGET ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
DELETE TARGET
=================================
*/

export const deleteTarget = async (
  req,
  res
) => {
  try {
    await MonthlyTarget.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Target deleted successfully",
    });
  } catch (error) {
    console.log(
      "DELETE TARGET ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
UPDATE PROGRESS
=================================
*/

export const updateProgress =
  async (req, res) => {
    try {
      const targets =
        await MonthlyTarget.find();

      for (const target of targets) {
        target.progress =
          target.targetAmount > 0
            ? Math.round(
                (target.actualAmount /
                  target.targetAmount) *
                  100
              )
            : 0;

        await target.save();
      }

      res.json({
        success: true,
        message:
          "Progress updated",
      });
    } catch (error) {
      console.log(
        "PROGRESS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };