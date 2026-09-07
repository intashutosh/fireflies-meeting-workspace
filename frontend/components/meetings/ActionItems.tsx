"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { ActionItem } from "@/types/meeting";

interface ActionItemsProps {
  meetingId: number;
  items: ActionItem[];
  onChange: (items: ActionItem[]) => void;
}

export default function ActionItems({
  meetingId,
  items,
  onChange,
}: ActionItemsProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] =
  useState<ActionItem | null>(null);

const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [saving, setSaving] = useState(false);

const [creating, setCreating] = useState(false);

const [newTitle, setNewTitle] = useState("");
const [newDescription, setNewDescription] = useState("");
const [creatingItem, setCreatingItem] = useState(false);

  async function toggleComplete(item: ActionItem) {
    try {
      const updatedItem = await apiFetch<ActionItem>(
        `/api/action-items/${item.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            completed: !item.completed,
          }),
        }
      );

      onChange(
        items.map((currentItem) =>
          currentItem.id === updatedItem.id
            ? updatedItem
            : currentItem
        )
      );
    } catch (error) {
      console.error("Failed to update action item:", error);
    }
  }

  async function deleteItem(itemId: number) {
    try {
      setDeletingId(itemId);

      await apiFetch<void>(
        `/api/action-items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      onChange(
        items.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Failed to delete action item:", error);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Action items
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {items.length}
          </span>

          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">
            No action items yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item)}
                className="mt-1 h-4 w-4"
              />

              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium ${
                    item.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {item.title}
                </p>

                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                )}

                {item.assignee && (
                  <p className="mt-2 text-xs text-gray-400">
                    Assigned to {item.assignee.name}
                  </p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                onClick={() => {
                    setEditingItem(item);
                    setEditTitle(item.title);
                    setEditDescription(item.description || "");
                }}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                title="Edit action item"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  disabled={deletingId === item.id}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Delete action item"
                >
                  <Trash2 size={15} />
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {editingItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Edit action item
        </h3>

        <button
          onClick={() => setEditingItem(null)}
          className="text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            value={editTitle}
            onChange={(event) =>
              setEditTitle(event.target.value)
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={editDescription}
            onChange={(event) =>
              setEditDescription(event.target.value)
            }
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setEditingItem(null)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          disabled={saving || !editTitle.trim()}
          onClick={async () => {
            try {
              setSaving(true);

              const updatedItem =
                await apiFetch<ActionItem>(
                  `/api/action-items/${editingItem.id}`,
                  {
                    method: "PATCH",
                    body: JSON.stringify({
                      title: editTitle,
                      description: editDescription,
                    }),
                  }
                );

              onChange(
                items.map((currentItem) =>
                  currentItem.id === updatedItem.id
                    ? updatedItem
                    : currentItem
                )
              );

              setEditingItem(null);
            } catch (error) {
              console.error(
                "Failed to edit action item:",
                error
              );
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  </div>
)}

{creating && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Add action item
        </h3>

        <button
          onClick={() => setCreating(false)}
          className="text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            value={newTitle}
            onChange={(event) =>
              setNewTitle(event.target.value)
            }
            placeholder="e.g. Send project proposal"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={newDescription}
            onChange={(event) =>
              setNewDescription(event.target.value)
            }
            rows={4}
            placeholder="Optional description"
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setCreating(false)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          disabled={creatingItem || !newTitle.trim()}
          onClick={async () => {
            try {
              setCreatingItem(true);

              const createdItem =
                await apiFetch<ActionItem>(
                  `/api/action-items/meeting/${meetingId}`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      title: newTitle,
                      description: newDescription,
                    }),
                  }
                );

              onChange([...items, createdItem]);

              setNewTitle("");
              setNewDescription("");
              setCreating(false);
            } catch (error) {
              console.error(
                "Failed to create action item:",
                error
              );
            } finally {
              setCreatingItem(false);
            }
          }}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creatingItem ? "Adding..." : "Add item"}
        </button>
      </div>
    </div>
  </div>
)}
      
    </div>
  );
}