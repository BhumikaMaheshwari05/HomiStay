const Listing = require("../models/listing.js");


module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({})
    //console.log(allListings);
    res.render("listings/index",{allListings})
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/neww")
  }

module.exports.showProperty=async (req,res)=>{
    let {id}=req.params
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing)
    {
      req.flash("error","Listing you trying to access does not exist")
      res.redirect("/listings")
    }
    else{
      res.render('listings/show',{listing})
    }
  }

module.exports.addProperty = async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        let { title, description, price, location, country } = req.body;

        
        const newListing = new Listing({
            title,
            description,
            price,
            location,
            country,
            image: { url, filename }
        });

        newListing.owner = req.user._id;
        await newListing.save();

        req.flash('success', 'New Listing Created');
        res.redirect('/listings');
    } catch (err) {
        req.flash('error', 'Failed to create listing. Please try again.');
        res.redirect('/listings');
    }
};

  module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params
    let listing = await Listing.findById(id);
    if(!listing)
      {
        req.flash("error","Listing you trying to access does not exist")
        res.redirect("/listings")
      }
      else{
        let originalImage=listing.image.url
       originalImage = originalImage.replace("/upload", "/upload/w_150");
        res.render("listings/editt",{listing,originalImage})
      }
    
  }

  module.exports.updateProperty=async (req,res)=>{
    let {id}=req.params
    let {title,description,price,location,country}=req.body

    let listing=await Listing.findByIdAndUpdate(
      id,
      { title, description, price, location, country },
      { new: true, runValidators: true }
    );
    if(typeof req.file!="undefined"){
      let url=req.file.path
  let filename=req.file.filename
  listing.image={url,filename}
  await listing.save()
    }
   req.flash("success","Listing Updated")
   res.redirect('/listings')
  }

module.exports.deleteProperty=async (req, res) => {
    let { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success","Listing Deleted")
      res.redirect('/listings');
  }