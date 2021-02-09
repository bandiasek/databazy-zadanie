const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))

app.get('/', (req, res)=>{
      res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const mssql = require('mssql')
const dbConfig = {
      server: '172.24.99.254',
      database: 'db_zadanie',
      user: 'SA',
      password: 'Miriam123.',
      port: 1433
}

app.post('/api/create', (req, res) => {
      const meno = req.body.meno 
      const prezvisko = req.body.prezvisko
      const titul = req.body.titul
      const ulica = req.body.ulica 
      const mesto = req.body.mesto 
      const psc = req.body.psc.replace(' ','') 
      const telefon = req.body.telefon
      const email = req.body.telefon 
      const stav = parseInt(req.body.stav)
      const vzdelanie = parseInt(req.body.stav)
      const vek = parseInt(req.body.stav)

      mssql.query(
      `insert into p.ciselnik_zaujemcov (titul, meno, priezvisko, ulica, mesto, PSC, telefon, email, ID_stav, ID_vzdelanie, vek) OUTPUT Inserted.ID_zaujemca values ('${titul}', '${meno}', '${prezvisko}', '${ulica}', '${mesto}', 
      ${psc}, '${telefon}', '${email}', '${stav}', '${vzdelanie}', '${vek}')`,
            (err, result)=>{
                  if(err) {
                        res.send(err)
                  } else {
                        res.send(result)
                  }
            })
})

app.post('/api/add', (req, res) => {
      const ID_zaujemca = req.body.ID_zaujemca
      const ID_profesie = req.body.ID_profesie
      const poznamka = req.body.poznamka

      mssql.query(
      `insert into p.ciselnik_profesii_zaujemcov (ID_zaujemca, Id_profesie, poznamka) values (${ID_zaujemca}, ${ID_profesie}, '${poznamka}')`,
            (err, result)=>{
                  if(err) {
                        res.send(err)
                  } else {
                        res.send(result)
                  }
            })
})

app.get('/api/zaujemci', (req, res) => {
      mssql.query('SELECT*FROM p.ciselnik_zaujemcov', (err, result) => {
            if (err) {
                  console.log(err)
            } else {
                  res.send(result)
            }
      }) 
})

app.get('/api/profzam', (req, res) => {
      mssql.query('SELECT titul,meno,priezvisko,nazov_profesie,stav,poznamka FROM p.ciselnik_zaujemcov AS z INNER JOIN p.ciselnik_profesii_zaujemcov AS p ON z.ID_zaujemca=p.ID_zaujemca INNER JOIN p.stav AS s ON z.ID_stav=s.ID_stav INNER JOIN p.ciselnik_profesii AS r ON p.ID_profesie=r.ID_profesie ORDER BY meno DESC', (err, result) => {
            if (err) {
                  console.log(err)
            } else {
                  res.send(result)
            }
      }) 
})

app.get('/api/profesie', (req, res) => {
      mssql.query('SELECT*FROM p.ciselnik_profesii', (err, result) => {
            if (err) {
                  console.log(err)
            } else {
                  res.send(result)
            }
      }) 
})

app.get('/api/stav', (req, res) => {
      mssql.query('SELECT*FROM p.stav', (err, result) => {
            if (err) {
                  console.log(err)
            } else {
                  res.send(result)
            }
      }) 
})

app.get('/api/vzdelanie', (req, res) => {
      mssql.query('SELECT*FROM p.vzdelanie', (err, result) => {
            if (err) {
                  console.log(err)
            } else {
                  res.send(result)
            }
      }) 
})

mssql.connect(dbConfig).then(pool => {
      if(pool.connecting){
            console.log('Pripajam k databaze....')
      }

      if(pool.connected){
            app.listen(3000, () => {
                  console.log('Server pocuva na porte 3000')
            })
      }

      return pool
}).catch(e => console.log('Nepodarilo sa pripojit k databaze... :( ') )


