// controllers/author.controller.js
import ModelFactory from '../models/model-factory.js';

const Author = ModelFactory.Author;

// Obtener todos los autores
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.getAll();
    res.status(200).json({
      success: true,
      data: authors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los autores',
      error: error.message
    });
  }
};

// Obtener un autor por ID
export const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.getById(id);
    
    if (!author) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún autor con el ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el autor',
      error: error.message
    });
  }
};

// Crear un nuevo autor
export const createAuthor = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud:', req.body);
    const { first_name, last_name, birth_date, nationality } = req.body;
    
    // Validación básica
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y apellido del autor son requeridos'
      });
    }
    
    const newAuthor = await Author.create({ 
      first_name, 
      last_name, 
      birth_date, 
      nationality 
    });
    
    res.status(201).json({
      success: true,
      message: 'Autor creado exitosamente',
      data: newAuthor
    });
  } catch (error) {
    console.error('Error al crear autor:', error);  
    res.status(500).json({
      success: false,
      message: 'Error al crear el autor',
      error: error.message
    });
  }
};

// Actualizar un autor
export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, birth_date, nationality } = req.body;
    
    // Verificamos si el autor existe
    const existingAuthor = await Author.getById(id);
    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún autor con el ID ${id}`
      });
    }
    
    // Validación básica
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y apellido del autor son requeridos'
      });
    }
    
    const updatedAuthor = await Author.update(id, { 
      first_name, 
      last_name, 
      birth_date, 
      nationality 
    });
    
    res.status(200).json({
      success: true,
      message: 'Autor actualizado exitosamente',
      data: updatedAuthor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el autor',
      error: error.message
    });
  }
};

// Eliminar un autor
export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificamos si el autor existe
    const existingAuthor = await Author.getById(id);
    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún autor con el ID ${id}`
      });
    }
    
    const deleted = await Author.delete(id);
    
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Autor eliminado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar el autor'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el autor',
      error: error.message
    });
  }
};

// Obtener los libros de un autor
export const getAuthorBooks = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificamos si el autor existe
    const existingAuthor = await Author.getById(id);
    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún autor con el ID ${id}`
      });
    }
    
    const books = await Author.getBooks(id);
    
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los libros del autor',
      error: error.message
    });
  }
};