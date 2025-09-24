export class ToastrMessages {
  static Add: string = "Inserted successfully !";   // Record Add Notifications
  static Update: string = "Updated successfully !"; // Record Update Notifications
  static Delete: string = "Deleted successfully !"; // Record Delete Notifications
  static Error: string = "Error while processing request !"; // Error during CRUD
  static Save: string = "Saved successfully !";

  static getMsg(moduleName: string, msg: string): string {
    if (!moduleName || moduleName.trim() === "") {
      return msg;
    } else {
      return `${moduleName} ${msg}`;
    }
  }
}

export class ToastrModules {
  static Employee: string = "Employee:";
}