const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const Serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.send(Serializador.serializar(resultados))
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        res.status(201)
        const Serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.send(Serializador.serializar(fornecedor))
    } catch (erro) {
        proximo(erro)
    }
})

roteador.get('/:id', async (req, res, proximo) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        res.status(200)
        const Serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['email', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.send(Serializador.serializar(fornecedor))
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async (req, res, proximo) => {
    try {
        const id = req.params.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204)
        res.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:id', async (req, res, proximo) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({id: id })
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204)
        res.end()
    } catch (erro) {
        proximo(erro)
    }

})

module.exports = roteador