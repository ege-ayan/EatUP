import axios from "axios";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZATION" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  location: string;
}

export interface CreateUserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  organizationId?: string;
}

export interface UpdateUserData {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  organizationId?: string | null;
}

export const usersService = {
  async getUsers(search?: string, role?: string) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role) params.append("role", role);

    const response = await axios.get<{
      success: boolean;
      users: User[];
      total: number;
    }>(`/api/admin/users?${params.toString()}`);
    return response.data;
  },

  async getOrganizations() {
    const response = await axios.get<{
      success: boolean;
      organizations: Organization[];
    }>("/api/admin/organizations/available");
    return response.data;
  },

  async createUser(data: CreateUserData) {
    const response = await axios.post("/api/admin/users", data);
    return response.data;
  },

  async updateUser(data: UpdateUserData) {
    const response = await axios.patch("/api/admin/users", data);
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await axios.delete(`/api/admin/users?id=${id}`);
    return response.data;
  },
};
