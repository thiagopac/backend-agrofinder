import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Imovel from 'App/Models/Imovel'

export default class ImovelController {
  public async buscarPorId({ params }: HttpContextContract) {
    try {
      const imovel = await Imovel.findOrFail(params.id)
      return imovel
    } catch (error) {
      console.error(error)
    }
  }

  public async buscaComFiltros({ request }: HttpContextContract) {
    try {
      const uf = request.input('uf')
      const municipio = request.input('municipio')
      const nirf = request.input('nirf')
      const page = request.input('page', 1)
      const size = request.input('size', 10)

      const query = Imovel.query()

      if (uf) {
        query.where('uf', uf)
      }
      if (municipio) {
        query.where('municipio', municipio)
      }
      if (nirf) {
        query.where('nirf', nirf)
      }

      const imoveis = await query.paginate(page, size)
      return imoveis
    } catch (error) {
      console.error(error)
    }
  }
}
