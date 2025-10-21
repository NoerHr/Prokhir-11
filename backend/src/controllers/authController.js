const userRepository = require("../repositories/userRepository");

class AuthController {
    async register(req, res) {
        try {
            const { name, nim, email, password, contact } = req.body;

            const existingUserByName = await userRepository.findByName(name);
            if (existingUserByName) {
                return res.status(409).json({
                    message: "Username sudah digunakan",
                });
            }

            const existingUserByNim = await userRepository.findByNim(nim);
            if (existingUserByNim) {
                return res.status(409).json({
                    message: "NIM sudah terdaftar",
                });
            }

            const userData = {
                name,
                nim,
                email,
                password,
                contact: contact || "-",
            };

            const newUser = await userRepository.create(userData);
            const { password: _, ...userWithoutPassword } = newUser;

            res.status(201).json({
                message: "Registrasi berhasil",
                user: { ...userWithoutPassword, role: "user" },
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat registrasi",
                error: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { name, password } = req.body;

            const user = await userRepository.findByCredentials(name, password);

            if (user) {
                const { password: _, ...userWithoutPassword } = user;
                return res.status(200).json({
                    message: "Login berhasil",
                    user: { ...userWithoutPassword, role: "admin" },
                });
            }

            const registeredUser = await userRepository.findUserByCredentials(name, password);

            if (registeredUser) {
                const { password: _, ...userWithoutPassword } = registeredUser;
                return res.status(200).json({
                    message: "Login berhasil",
                    user: { ...userWithoutPassword, role: "user" },
                });
            }

            res.status(401).json({
                message: "Username atau password salah",
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat login",
                error: error.message,
            });
        }
    }
}

module.exports = new AuthController();
