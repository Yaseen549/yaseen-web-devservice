"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Trash2,
  Eye,
  Loader2,
  Search,
  MessageSquare,
  Lightbulb,
  Bug,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import ConfirmWithInputDialog from "./dialogBoxes/ConfirmWithInputDialog";

// --- CONSTANTS ---
const CONFIRMATION_TEXT_SINGLE = "DELETE";
const CONFIRMATION_TEXT_BULK = "DELETE ALL";

// --- HELPER ---
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(seconds / 60) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

// --- MODAL ---
function FeedbackModal({ feedback, onClose }) {
  if (!feedback) return null;

  const typeIcon = {
    "Bug Report": <Bug className="text-red-600 w-5 h-5" />,
    "Feature Request": <Lightbulb className="text-yellow-500 w-5 h-5" />,
    "General Feedback": <MessageSquare className="text-blue-500 w-5 h-5" />,
  }[feedback.feedback_type] || <MessageSquare className="text-gray-500 w-5 h-5" />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {typeIcon}
            <h3 className="text-xl font-semibold text-gray-900">
              {feedback.feedback_type}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <span className="font-semibold text-gray-500 w-24">Email:</span>
            <span>{feedback.email || "—"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Message:</span>
            <p className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap">
              {feedback.message}
            </p>
          </div>
          <div className="text-sm text-gray-400">
            Submitted: {new Date(feedback.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function FeedbackContent() {
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSingleDeleteOpen, setIsSingleDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Init Supabase ---
  useEffect(() => {
    async function init() {
      const token = await getToken({ template: "supabase" });
      setSupabase(createPrivateSupabaseClient(token));
    }
    init();
  }, [getToken]);

  // --- Fetch Feedback ---
  const fetchFeedback = async () => {
    if (!supabase) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("yms_feedback")
      .select("*")
      .order("created_at", { ascending: false });

      console.log(data);
      
    if (error) console.error(error.message);
    else setFeedbacks(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, [supabase]);

  // --- Filtered Feedback ---
  const filteredFeedback = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return feedbacks.filter(
      (f) =>
        f.feedback_type.toLowerCase().includes(term) ||
        (f.email && f.email.toLowerCase().includes(term)) ||
        f.message.toLowerCase().includes(term)
    );
  }, [feedbacks, searchTerm]);

  // --- Selection ---
  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredFeedback.map((f) => f.id)));
    } else setSelectedIds(new Set());
  };

  const isAllSelected =
    filteredFeedback.length > 0 && selectedIds.size === filteredFeedback.length;
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected;

  // --- Delete Logic ---
  const handleOpenDeleteConfirm = (feedback) => {
    setItemToDelete(feedback);
    setIsSingleDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !supabase) return;
    setIsProcessing(true);
    const { error } = await supabase
      .from("yms_feedback")
      .delete()
      .eq("id", itemToDelete.id);
    if (!error)
      setFeedbacks((f) => f.filter((x) => x.id !== itemToDelete.id));
    setIsSingleDeleteOpen(false);
    setItemToDelete(null);
    setIsProcessing(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0 || !supabase) return;
    setIsProcessing(true);
    const idsToDelete = Array.from(selectedIds);
    const { error } = await supabase
      .from("yms_feedback")
      .delete()
      .in("id", idsToDelete);
    if (!error)
      setFeedbacks((f) => f.filter((x) => !idsToDelete.includes(x.id)));
    setSelectedIds(new Set());
    setIsBulkDeleteOpen(false);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 text-gray-800">
      {/* --- Search & Bulk Actions --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email, type, message..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-red-600 text-red-100 hover:bg-red-700"
            >
              <Trash2 size={14} /> Delete {selectedIds.size}
            </button>
          </div>
        )}
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {isLoading ? (
          <div className="text-center py-24">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-600" />
            <p className="text-lg font-medium">Loading Feedback...</p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg font-medium">No Feedback Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600"
                      checked={isAllSelected}
                      ref={(el) => el && (el.indeterminate = isIndeterminate)}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFeedback.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600"
                        checked={selectedIds.has(feedback.id)}
                        onChange={() => handleSelectOne(feedback.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{feedback.feedback_type}</td>
                    <td className="px-4 py-3">{feedback.email || "—"}</td>
                    <td
                      className="px-4 py-3 truncate max-w-sm cursor-pointer"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      {feedback.message}
                    </td>
                    <td className="px-4 py-3">{timeAgo(feedback.created_at)}</td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(feedback)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
      <ConfirmWithInputDialog
        open={isSingleDeleteOpen}
        onClose={() => setIsSingleDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        username={CONFIRMATION_TEXT_SINGLE}
        action="Delete Feedback"
        description="This feedback will be permanently removed."
      />
      <ConfirmWithInputDialog
        open={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        username={CONFIRMATION_TEXT_BULK}
        action={`Delete ${selectedIds.size} Feedback`}
        description={`This will permanently delete ${selectedIds.size} feedback items. This action cannot be undone.`}
      />
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      )}
    </div>
  );
}
