import { Inngest } from "inngest";
import User from "../models/User.js"; // adjust the path to your User model

export const inngest = new Inngest({ id: "movie-tickets-booking" });

/**
 * User Creation Handler
 */
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    try {
      await User.create(userData);
      console.log("User synced to DB:", userData);
    } catch (error) {
      console.error("Failed to sync user:", error.message);
      throw error;
    }
  }
);

/**
 * User Deletion Handler
 */
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    try {
      await User.findByIdAndDelete(id);
      console.log(`User with ID ${id} deleted from DB.`);
    } catch (error) {
      console.error("Failed to delete user:", error.message);
      throw error;
    }
  }
);

/**
 * User Update Handler
 */
const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0]?.email_address || "",
      image: image_url,
    };

    try {
      const result = await User.findByIdAndUpdate(id, updatedData, { new: true });
      if (result) {
        console.log(`User with ID ${id} updated:`, result);
      } else {
        console.log(`User with ID ${id} not found to update.`);
      }
    } catch (error) {
      console.error("Failed to update user:", error.message);
      throw error;
    }
  }
);

// ✅ Export all functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
