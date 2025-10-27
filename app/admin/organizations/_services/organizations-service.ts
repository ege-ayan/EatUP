import axios from "axios";

export interface Organization {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  createdAt: string;
  updatedAt: string;
  users: Array<{
    id: string;
    name: string;
    surname: string;
    email: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  organization?: { id: string; name: string };
}

export interface CreateOrganizationData {
  name: string;
  location: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UpdateOrganizationData {
  id: string;
  name?: string;
  location?: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

export const organizationsService = {
  async getOrganizations(search?: string) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await axios.get<{
      success: boolean;
      organizations: Organization[];
      total: number;
    }>(`/api/admin/organizations?${params.toString()}`);
    return response.data;
  },

  async getAvailableUsers() {
    const response = await axios.get<{
      success: boolean;
      users: User[];
    }>("/api/admin/users");
    return response.data;
  },

  async createOrganization(data: CreateOrganizationData) {
    const response = await axios.post("/api/admin/organizations", data);
    return response.data;
  },

  async updateOrganization(data: UpdateOrganizationData) {
    const response = await axios.patch("/api/admin/organizations", data);
    return response.data;
  },

  async deleteOrganization(id: string) {
    const response = await axios.delete(`/api/admin/organizations?id=${id}`);
    return response.data;
  },

  async assignUser(userId: string, organizationId: string) {
    const response = await axios.patch("/api/admin/users", {
      id: userId,
      organizationId,
    });
    return response.data;
  },

  async removeUser(userId: string) {
    const response = await axios.patch("/api/admin/users", {
      id: userId,
      organizationId: null,
    });
    return response.data;
  },
};
