const express = require('express')
const server = express()

const db = require('./db')

// const ideas = [
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae atque consequatur in laborum corrupti ad nisi sed, nobis accusantium vel, nihil non adipisci quos cum magnam corporis. Voluptatum, doloremque quasi?",
//     url: "https://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729005.svg" ,
//     title: "Atividade Física",
//     category: "Saúde",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae atque consequatur in laborum corrupti ad nisi sed, nobis accusantium vel, nihil non adipisci quos cum magnam corporis. Voluptatum, doloremque quasi?",
//     url: "https://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729027.svg" ,
//     title: "Atividade Mental",
//     category: "Meditação",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae atque consequatur in laborum corrupti ad nisi sed, nobis accusantium vel, nihil non adipisci quos cum magnam corporis. Voluptatum, doloremque quasi?",
//     url: "https://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729032.svg" ,
//     title: "Karaokê",
//     category: "Diversão",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae atque consequatur in laborum corrupti ad nisi sed, nobis accusantium vel, nihil non adipisci quos cum magnam corporis. Voluptatum, doloremque quasi?",
//     url: "https://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729038.svg" ,
//     title: "Pintura",
//     category: "Artes",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae atque consequatur in laborum corrupti ad nisi sed, nobis accusantium vel, nihil non adipisci quos cum magnam corporis. Voluptatum, doloremque quasi?",
//     url: "https://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729048.svg" ,
//     title: "Recortes",
//     category: "Artes",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae atque consequatur in laborum corrupti ad nisi sed, nobis accusantium vel, nihil non adipisci quos cum magnam corporis. Voluptatum, doloremque quasi?",
//     url: "https://rocketseat.com.br"
//   },
// ]


//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

// habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))

// configuraçao do nunjucks
const nunjucks = require("nunjucks")

nunjucks.configure("views", {
  express: server,
  noCache: true,
})

server.get("/", function(req,res) {

  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if(err)  { 
      console.log(err)
      return res.send('Erro no banco de dados!')
    }

    const reversedIdeas = [...rows].reverse()

    let lastIdeas = []
    for (let idea of reversedIdeas) {
      if(lastIdeas.length < 2){
        lastIdeas.push(idea)
      }
    }
    return res.render("index.html", {ideas: lastIdeas})

  })

})

server.get("/ideias", function(req,res) {

  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if(err)  { 
      console.log(err)
      return res.send('Erro no banco de dados!')
    }

    const reversedIdeas = [...rows].reverse()

    return res.render("ideias.html", {ideas: reversedIdeas})
  })
})

server.post("/", function(req,res) {
// Inserir dado na tabela
  const query = `
    INSERT INTO ideas(
      image,
      title,
      category,
      description,
      link
    ) 
    VALUES (?,?,?,?,?)
  `
  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link,
  ]
    

  db.run(query, values , function(err) {
    if(err)  { 
      console.log(err)
      return res.send('Erro no banco de dados!')
    }

     return res.redirect("/ideias")
  })



  console.log(req.body)
})

server.listen(3000)