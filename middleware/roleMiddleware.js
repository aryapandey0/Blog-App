

exports.allowRoles = (roles) => {
  return async(req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};


exports.allowOwnerOrAdmin=(model)=>{
    return async(req,res,next)=>{
          try {
        const resource = await model.findById(req.params.id);
         if (!resource) 
        return res.status(404).json({ message: "Resource not found" });
        const isOwner = resource.author?.toString()===req.user.userId;
              const isAdmin = req.user.role === 'admin';

               if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Access denied: not owner or admin" });
      }
      next();
    }catch (err) {
      res.status(500).json({ message: "Authorization error", error: err.message });
    }
    
    }

}