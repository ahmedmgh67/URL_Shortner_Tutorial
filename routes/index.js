var express = require('express');
var router = express.Router();
var fse = require("fs-extra")
var path = require("path")
/* GET home page. */
router.get('/', async function(req, res, next) {
  var fileData = await fse.readJSONSync(path.join(__dirname, "..", "data.json"))
  console.log(fileData)
  // fileData = ["h", "t"]
  res.render('index', { title: 'test', data: fileData});
});

router.get('/add',  async function(req, res){
  res.render("add")
})

router.post('/add', async function(req, res){
  var data = req.body
  var fileData = await fse.readJSONSync(path.join(__dirname, "..", "data.json"))
  fileData.push({
    short: data.short,
    long: data.long,
    name: data.name,
  })
  await fse.writeJSONSync(path.join(__dirname, "..", "data.json"), fileData)
  res.redirect('/')
})

router.get('/delete/:id', async function (req, res){
  var fileData = await fse.readJSONSync(path.join(__dirname, "..", "data.json"))
  fileData.splice(req.params.id, 1)
  await fse.writeJSONSync(path.join(__dirname, "..", "data.json"), fileData)
  res.redirect('/')
})
function search(nameKey, myArray){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].short === nameKey) {
          return myArray[i];
      }
  }
}
router.get("/:short", async function (req, res) {
  var fileData = await fse.readJSONSync(path.join(__dirname, "..", "data.json"))
  var resultObject = search(req.params.short, fileData)
  if(!resultObject){
    res.status(404).render("error", {"message": "Not Found", "error":{"status": "404", "stack":""}})
  }
  res.redirect(resultObject.long)
})


module.exports = router;
