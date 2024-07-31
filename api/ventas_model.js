const conexion = require("./conexion");
const fs = require("fs");
const path = require("path");

module.exports = {
  insertar(nombre, descripcion, precio) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)`,
        [nombre, descripcion, precio],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados.insertId);
        }
      );
    });
  },
  
  agregarFoto(idProducto, nombreFoto) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `INSERT INTO fotos_productos (id_producto, foto) VALUES (?, ?)`,
        [idProducto, nombreFoto],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados.insertId);
        }
      );
    });
  },
  
  obtener() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT id, nombre, descripcion, precio FROM productos`,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  },
  
  obtenerConFotos() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT * FROM productos`,
        async (err, resultados) => {
          if (err) reject(err);
          else {
            for (let x = 0; x < resultados.length; x++) {
              resultados[x].foto = await this.obtenerPrimeraFoto(resultados[x].id);
            }
            resolve(resultados);
          }
        }
      );
    });
  },
  
  obtenerPrimeraFoto(idProducto) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT foto FROM fotos_productos WHERE id_producto = ? LIMIT 1`,
        [idProducto],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados[0].foto);
        }
      );
    });
  },
  
  obtenerFotos(idProducto) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT id_producto, foto FROM fotos_productos WHERE id_producto = ?`,
        [idProducto],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  },
  
  obtenerPorId(id) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT id, nombre, descripcion, precio FROM productos WHERE id = ?`,
        [id],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados[0]);
        }
      );
    });
  },
  
  actualizar(id, nombre, precio) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `UPDATE productos SET nombre = ?, precio = ? WHERE id = ?`,
        [nombre, precio, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },
  
  eliminar(id) {
    return new Promise(async (resolve, reject) => {
      const fotos = await this.obtenerFotos(id);
      for (let m = 0; m < fotos.length; m++) {
        await fs.unlinkSync(path.join(__dirname, "fotos_productos", fotos[m].foto));
      }
      conexion.query(
        `DELETE FROM productos WHERE id = ?`,
        [id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },
};
