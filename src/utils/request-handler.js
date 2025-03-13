const handleRoute = (routeHandler) => async (req, res, next) => {
    try {
        await routeHandler(req, res);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = handleRoute; 
