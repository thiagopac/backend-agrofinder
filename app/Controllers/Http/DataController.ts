import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataService from 'App/Services/DataService'

export default class DataController {
  public async index({ request, response }: HttpContextContract) {
    const dataService = new DataService()
    const parte = request.input('parte')

    try {
      if (parte) {
        await dataService.processarParteEspecifica(parte)
      } else {
        await dataService.processarTodasAsPartes()
      }
      response.status(200).send('Dados processados com sucesso')
    } catch (error) {
      console.error(error)
      response.status(500).send('Erro ao processar os dados')
    }
  }
}
