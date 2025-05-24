// server/config/turso-adapter.js
import { query } from './turso.js';

/**
 * Adapta los modelos MySQL existentes para trabajar con Turso/SQLite
 * @param {string} tableName - Nombre de la tabla
 * @param {string} idColumn - Nombre de la columna ID
 * @param {Array} allowedFields - Campos permitidos para crear/actualizar
 * @returns {Object} - Métodos de modelo adaptados para Turso
 */
export function createTursoModel(tableName, idColumn, allowedFields) {
  return {
    /**
     * Obtiene todos los registros de la tabla
     * @returns {Promise<Array>} - Registros encontrados
     */
    async getAll() {
      const result = await query(`SELECT * FROM ${tableName}`);
      return result.rows || [];
    },

    /**
     * Obtiene un registro por su ID
     * @param {number|string} id - ID del registro a buscar
     * @returns {Promise<Object|null>} - Registro encontrado o null
     */
    async getById(id) {
      const result = await query(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    },

    /**
     * Busca registros que coincidan con criterios específicos
     * @param {Object} criteria - Criterios de búsqueda {campo: valor}
     * @returns {Promise<Array>} - Registros que coinciden
     */
    async findBy(criteria) {
      const fields = Object.keys(criteria);
      const values = Object.values(criteria);
      
      if (fields.length === 0) {
        return this.getAll();
      }

      const whereClause = fields.map(field => `${field} = ?`).join(' AND ');
      const result = await query(`SELECT * FROM ${tableName} WHERE ${whereClause}`, values);
      return result.rows || [];
    },

    /**
     * Crea un nuevo registro
     * @param {Object} data - Datos a insertar
     * @returns {Promise<Object>} - Registro creado con su ID
     */
    async create(data) {
      // Filtrar solo campos permitidos
      const filteredData = {};
      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          filteredData[field] = data[field];
        }
      });

      const fields = Object.keys(filteredData);
      const values = Object.values(filteredData);
      const placeholders = fields.map(() => '?').join(', ');
      
      const columns = fields.join(', ');
      
      const result = await query(
        `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      
      // Obtener el registro recién insertado si no lo devuelve directamente
      const lastInsertId = result.lastInsertRowid;
      return this.getById(lastInsertId);
    },

    /**
     * Actualiza un registro existente
     * @param {number|string} id - ID del registro a actualizar
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object|null>} - Registro actualizado o null
     */
    async update(id, data) {
      // Verificar si existe el registro
      const exists = await this.getById(id);
      if (!exists) return null;

      // Filtrar solo campos permitidos
      const filteredData = {};
      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          filteredData[field] = data[field];
        }
      });

      const fields = Object.keys(filteredData);
      const values = Object.values(filteredData);
      
      if (fields.length === 0) {
        return exists; // No hay campos para actualizar
      }

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      
      await query(
        `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = ?`,
        [...values, id]
      );
      
      return this.getById(id);
    },

    /**
     * Elimina un registro
     * @param {number|string} id - ID del registro a eliminar
     * @returns {Promise<boolean>} - true si se eliminó, false si no existía
     */
    async delete(id) {
      const exists = await this.getById(id);
      if (!exists) return false;

      await query(`DELETE FROM ${tableName} WHERE ${idColumn} = ?`, [id]);
      return true;
    },

    /**
     * Ejecuta una consulta personalizada
     * @param {string} sql - Consulta SQL
     * @param {Array} params - Parámetros para la consulta
     * @returns {Promise<Object>} - Resultado de la consulta
     */
    async raw(sql, params = []) {
      return query(sql, params);
    }
  };
}
