const prisma = require("../config/prisma");

/**
 * User Repository
 * Menggunakan Prisma ORM untuk database operations
 */
class UserRepository {
  /**
   * Mencari user berdasarkan credentials (login admin)
   */
  async findByCredentials(name, password) {
    return await prisma.user.findFirst({
      where: {
        name,
        password,
        role: "ADMIN",
      },
    });
  }

  /**
   * Mencari user berdasarkan name (untuk user biasa)
   */
  async findByName(name) {
    return await prisma.user.findFirst({
      where: {
        name,
        role: "USER",
      },
    });
  }

  /**
   * Mencari user berdasarkan NIM
   */
  async findByNim(nim) {
    return await prisma.user.findUnique({
      where: { nim },
    });
  }

  /**
   * Membuat user baru
   */
  async create(userData) {
    return await prisma.user.create({
      data: {
        name: userData.name,
        nim: userData.nim,
        email: userData.email,
        password: userData.password,
        contact: userData.contact,
        role: "USER",
      },
    });
  }

  /**
   * Mencari user berdasarkan credentials (login user biasa)
   */
  async findUserByCredentials(name, password) {
    return await prisma.user.findFirst({
      where: {
        name,
        password,
        role: "USER",
      },
    });
  }
}

module.exports = new UserRepository();
