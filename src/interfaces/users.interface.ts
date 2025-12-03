export interface User {
    idUser: number;
    name: string;
    email: string;
    resetPasswordToken: string;
    secretWord: string;
    imageFile: string;
    role: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }