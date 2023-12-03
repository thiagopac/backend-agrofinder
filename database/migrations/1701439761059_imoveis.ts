import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ImoveisSchema extends BaseSchema {
  protected tableName = 'imoveis'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nirf', 8).notNullable()
      table.decimal('area_total', 10, 1)
      table.string('codigo_incra', 13)
      table.string('nome_imovel_rural', 55)
      table.integer('situacao_imovel', 2).unsigned()
      table.string('endereco', 56)
      table.string('distrito', 40)
      table.string('uf', 2)
      table.string('municipio', 40)
      table.string('cep', 8)
      table.integer('codigo_imune', 1).unsigned()
      table.date('data_inscricao')
      table.integer('sncr', 1).unsigned()

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
