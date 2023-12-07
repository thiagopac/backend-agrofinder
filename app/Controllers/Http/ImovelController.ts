import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Imovel from 'App/Models/Imovel'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export default class ImovelController {
  public async buscarPorId({ params }: HttpContextContract) {
    try {
      const imovel = await Imovel.findOrFail(params.id)
      return imovel
    } catch (error) {
      console.error(error)
    }
  }

  public async buscaComFiltros({ request, response }: HttpContextContract) {
    try {
      const service = await axios.get(`${Env.get('SERVICES_URL')}`)

      if (service.data.status !== true) {
        return response.status(500).send(service.data)
      }

      const uf = request.input('uf')
      const municipio = request.input('municipio')?.toLowerCase()
      const nirf = request.input('nirf')
      const codigoIncra = request.input('codigoIncra')
      const nomeimovelrural = request.input('nomeimovelrural')?.toLowerCase()
      const page = request.input('page', 1)
      const size = request.input('size', 10)

      const query = Imovel.query()

      if (uf) {
        query.where('uf', uf)
      }
      if (municipio) {
        query.where('municipio', 'like', `%${municipio}%`)
      }
      if (nirf) {
        query.where('nirf', 'like', `%${nirf}%`)
      }

      if (codigoIncra) {
        query.where('codigoincra', 'like', `%${codigoIncra}%`)
      }

      if (nomeimovelrural) {
        query.where('nomeimovelrural', 'like', `%${nomeimovelrural}%`)
      }

      const imoveis = await query.paginate(page, size)
      return imoveis
    } catch (error) {
      console.error(error)
    }
  }
}
