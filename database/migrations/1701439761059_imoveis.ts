import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ImoveisSchema extends BaseSchema {
  protected tableName = 'imoveis'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nirf', 8).notNullable()
      table.decimal('areatotal', 10, 1)
      table.string('codigoincra', 13)
      table.string('nomeimovelrural', 55)
      table.integer('situacaoimovel', 2).unsigned()
      table.string('endereco', 56)
      table.string('distrito', 40)
      table.string('uf', 2)
      table.string('municipio', 40)
      table.string('cep', 8)
      table.integer('codigoimune', 1).unsigned()
      table.date('datainscricao')
      table.integer('sncr', 1).unsigned()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
