import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Imovel extends BaseModel {
  public static table = 'imoveis'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nirf: string

  @column()
  public areaTotal: number

  @column()
  public codigoIncra: string

  @column()
  public nomeImovelRural: string

  @column()
  public situacaoImovel: number

  @column()
  public endereco: string

  @column()
  public distrito: string

  @column()
  public uf: string

  @column()
  public municipio: string

  @column()
  public cep: string

  @column()
  public codigoImune: number

  @column.date()
  public dataInscricao: DateTime

  @column()
  public sncr: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
