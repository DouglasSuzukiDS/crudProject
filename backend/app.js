const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql')

require('dotenv').config()

// Create Connect
const db = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE 
})

app.use(express.json())
app.use(cors())

app.get('/products', async(req, res) => {

   let SQL = "SELECT * FROM shop"

   db.query(SQL, (err, result) => {
      if(err) {
         console.log('Erro ao listar os produtos')
         console.log(err)
      } else {
         // console.log(result)
         res.send(result)
      }
   })
})

app.get('/products/:id', (req, res) => {
   const { id } = req.params

   // let SQL = "SELECT pdt_name, pdt_type, pdt_qtd, pdt_price FROM shop WHERE id =?"
   let SQL = "SELECT * FROM shop WHERE id =?"

   db.query(SQL, [id], (err, result) => {
      if(err) {
         console.log('Erro ao localizar o produto')
         console.log(err)
      } else {
         // console.log(result)
         res.send(result)
      }
   })
})

app.post('/register', async(req, res) => {
   const { name } = req.body
   const { type } = req.body
   const { qtd } = req.body
   const { price } = req.body
   
   let SQL = "INSERT INTO shop (pdt_name, pdt_type, pdt_qtd, pdt_price) VALUES (?, ?, ?, ?)"
   
   // `INSERT INTO shop (pdt_name, pdt_type, pdt_qtd, pdt_price) VALUES (?, ?, ?, ?), 
   // [${name}, ${type}, ${qtd}, ${price}]`, 

   db.query(SQL, [name, type, qtd, price],  async(err, result) => {
      if(err) {
         console.log({msg: 'Erro ao cadastrar o produto'})
         console.log(err)
      } else {
         await res.send({msg: 'Produto Cadastrado com Sucesso', result})
      }
   })
   console.log(`Produto Registrado: Nome: ${name}, Tipo: ${type}, Quantidade: ${qtd}, Preço: ${price}`)
})

app.put('/edit/:id', (req, res) => {
   const { name } = req.body
   const { type } = req.body
   const { qtd } = req.body
   const { price } = req.body
   const { id } = req.params

   // console.log('ID no Back', id)
   console.log(id, name, type, qtd, price)

   let SQL = "UPDATE shop SET pdt_name = ?, pdt_type = ?, pdt_qtd = ?, pdt_price = ? WHERE id = ?"
   
   db.query(SQL, [name, type, qtd, price, id], async(err, result) => {

      if(err) {
         await console.log({msg: 'Erro ao Editar o produto'})
         await console.log(err)
      } else {
         await res.send({msg: 'Produto Atualizado com Sucesso', result})
      }
   })

   console.log(`Produto Editado: Nome: ${name}, Tipo: ${type}, Quantidade: ${qtd}, Preço: ${price}`)
})

app.delete('/delete/:id', (req, res) => {
   const { id } = req.params
   
   let SQL = "DELETE FROM shop WHERE id = ?"

   db.query(SQL, id, (err, result) => {
      if(err) {
         console.log({msg: 'Erro ao deletar o produto'})
         console.log(err)
      } else {
         res.send({msg: 'Produto Deletado com Sucesso', result})
      }
   })

   console.log(`Produto Deletado de ID: ${id}`)
})

app.listen(3001, console.log('Backend Running in Port 3001'))
