import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { load } from 'cheerio'
import Imovel from 'App/Models/Imovel'
import readline from 'readline'
// import { Transform } from 'stream'
// import path from 'path'
// import fs from 'fs'

export default class DataService {
  private SITE_URL = Env.get('SITE_URL')

  public static processarLinha(linha: string) {
    const parseNumber = (str: string) => {
      const num = parseFloat(str.trim().replace(',', '.'))
      return isNaN(num) ? null : num
    }

    const parseDate = (str) => {
      if (!/^\d{8}$/.test(str)) return null

      const year = str.substring(0, 4)
      const month = str.substring(4, 6)
      const day = str.substring(6, 8)

      if (month < '01' || month > '12' || day < '01' || day > '31') return null

      // Verifica se a data é 1900-02-29 e corrige para 1900-02-28 (pois 1900 não é bissexto. porque é divisível por 4, porém não divisível por 400)
      if (year === '1900' && month === '02' && day === '29') {
        return '1900-02-28'
      }

      return `${year}-${month}-${day}`
    }

    const parseSncrCodigoImune = (str: string) => {
      return str.includes('NAO') ? 0 : 1
    }

    return {
      nirf: linha.substring(0, 8).trim(),
      areaTotal: parseNumber(linha.substring(8, 17)),
      codigoIncra: linha.substring(17, 30).trim(),
      nomeImovelRural: linha.substring(30, 85).trim(),
      situacaoImovel: parseInt(linha.substring(85, 87).trim()) || null,
      endereco: linha.substring(87, 143).trim(),
      distrito: linha.substring(143, 183).trim(),
      uf: linha.substring(183, 185).trim(),
      municipio: linha.substring(185, 225).trim(),
      cep: linha.substring(225, 233).trim(),
      dataInscricao: parseDate(linha.substring(233, 241)),
      codigoImune: parseSncrCodigoImune(linha.substring(241, 244)),
      sncr: parseSncrCodigoImune(linha.substring(244, 247)),
    }
  }

  public static async salvarNoBanco(dadosImovel: any): Promise<void> {
    await Imovel.create(dadosImovel)
  }

  public static formatarComoCSV(objeto: any): string {
    const valores = Object.values(objeto)
    return valores.join(';') + '\n'
  }

  public async obterLinksDasPartes(): Promise<string[]> {
    const pageResponse = await axios.get(this.SITE_URL)
    const $ = load(pageResponse.data)
    const partesLinks = $('a')
      .map((i, link) => {
        const href = $(link).attr('href')
        if (href && href.includes('.PARTE')) {
          return href
        }
      })
      .get()
      .filter(Boolean)
    return partesLinks
  }

  public async baixarEProcessarParte(parte: string): Promise<void> {
    const url = `${this.SITE_URL}${parte}`
    console.log('URL:', url)

    const response = await axios.get(url, { responseType: 'stream' })
    const reader = readline.createInterface({ input: response.data })

    for await (const line of reader) {
      if (line) {
        const objetoLinha = DataService.processarLinha(line)
        try {
          await DataService.salvarNoBanco(objetoLinha)
        } catch (err) {
          console.error('Erro ao salvar no banco:', err)
        }
      }
    }

    console.log(`Arquivo ${parte} processado.`)
  }

  public async processarTodasAsPartes(): Promise<void> {
    const partesLinks = await this.obterLinksDasPartes()
    for (const link of partesLinks) {
      console.log(`Processando arquivo: ${link}`)
      await this.baixarEProcessarParte(link)
    }
    console.log('Todos os arquivos foram processados e salvos no banco de dados.')
  }

  public async processarParteEspecifica(numeroParte: string) {
    console.log(`Processando parte ${numeroParte}...`)

    const partesLinks = await this.obterLinksDasPartes()
    const parteLink = partesLinks.find((link) =>
      link.includes(`PARTE${numeroParte.padStart(2, '0')}`)
    )

    if (parteLink) {
      await this.baixarEProcessarParte(parteLink)
      console.log(`Parte ${numeroParte} processada.`)
    } else {
      console.log(`Parte ${numeroParte} não encontrada.`)
    }
  }
}
