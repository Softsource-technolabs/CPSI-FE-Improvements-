import { X } from "lucide-react";
import React from "react";

interface DrawerProps {
  drawerOpen: boolean;
  closeDrawer: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  drawerOpen,
  closeDrawer,
  title = "Details",
  children,
  width = "50vw",
}) => {
  if (!drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
      onClick={closeDrawer}
    >
      <div
        className="fixed top-0 right-0 h-full bg-white rounded-l-lg shadow-lg flex flex-col"
        style={{
          width: width
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={closeDrawer}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 flex-1">
          <div className="space-y-4">
            <div className="break-words whitespace-pre-wrap">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
