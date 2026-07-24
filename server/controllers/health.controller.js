export const checkHealth = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'SkillSync API is running',
    });
  } catch (error) {
    next(error);
  }
};
