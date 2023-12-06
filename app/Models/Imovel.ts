import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Imovel extends BaseModel {
  public static table = 'imoveis'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nirf: string

  @column()
  public areatotal: number

  @column()
  public codigoincra: string

  @column()
  public nomeimovelrural: string

  @column()
  public situacaoimovel: number

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
  public codigoimune: number

  @column.date()
  public datainscricao: DateTime

  @column()
  public sncr: number
}
