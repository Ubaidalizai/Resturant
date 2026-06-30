import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";
import InputField from "../Components/UI/InputField";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "present", label: "Present" },
  { key: "absent", label: "Absent" },
  { key: "unmarked", label: "Unmarked" },
];

export default function Attendance() {
  const { get, post, put } = useApi();
  const { t } = useTranslation("common");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const res = await get(`/api/v1/attendance/date/${date}`);
      setRecords(res.data.data?.records || []);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToLoadData", { defaultValue: "Failed to load attendance" }));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const updateStatus = async (staffId, status) => {
    setSaving(staffId);
    try {
      await post("/api/v1/attendance/update", {
        staffId,
        date: selectedDate,
        status,
      });
      setRecords((prev) =>
        prev.map((r) => (r.staffId === staffId ? { ...r, status } : r))
      );
      toast.success(t("UpdatedSuccessfully", { defaultValue: "Updated successfully" }));
    } catch (err) {
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed", { defaultValue: "Operation failed" }));
    } finally {
      setSaving(null);
    }
  };

  const bulkUpdate = async (status) => {
    setLoading(true);
    try {
      await put(`/api/v1/attendance/bulk/${selectedDate}`, { status });
      setRecords((prev) => prev.map((r) => ({ ...r, status })));
      toast.success(t("AllStaffUpdated", { defaultValue: `All staff marked as ${status}` }));
    } catch (err) {
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed", { defaultValue: "Operation failed" }));
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = !searchQuery.trim()
        || (record.fullName || "").toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "all"
        || (statusFilter === "unmarked" && !record.status)
        || (statusFilter === "present" && (record.status === "present" || record.status === "leave"))
        || (statusFilter === "absent" && record.status === "absent");
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const leaveCount = records.filter((r) => r.status === "leave").length;
  const unmarkedCount = records.filter((r) => !r.status).length;

  return (
    <div className="space-y-4">
      <div className="erp-panel p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div>
            <label className="erp-label">{t("SelectDate", { defaultValue: "Select Date" })}</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="erp-input max-w-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-success" onClick={() => bulkUpdate("present")} disabled={loading}>
              {t("MarkAllPresent", { defaultValue: "Mark All Present" })}
            </button>
            <button type="button" className="btn-danger" onClick={() => bulkUpdate("absent")} disabled={loading}>
              {t("MarkAllAbsent", { defaultValue: "Mark All Absent" })}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("Present", { defaultValue: "Present" })}</div>
            <div className="erp-stat-value text-green-600">{presentCount}</div>
          </div>
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("Absent", { defaultValue: "Absent" })}</div>
            <div className="erp-stat-value text-red-600">{absentCount}</div>
          </div>
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("Leave", { defaultValue: "Leave" })}</div>
            <div className="erp-stat-value text-amber-600">{leaveCount}</div>
          </div>
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("Unmarked", { defaultValue: "Unmarked" })}</div>
            <div className="erp-stat-value">{unmarkedCount}</div>
          </div>
        </div>
      </div>

      <div className="erp-panel p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 min-w-0">
            <InputField
              label={t("SearchByName", { defaultValue: "Search by staff name" })}
              type="text"
              placeholder={t("SearchStaff", { defaultValue: "Search staff..." })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="min-w-[200px]">
            <label className="erp-label">{t("AttendanceStatus", { defaultValue: "Attendance Status" })}</label>
            <select className="erp-select w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_FILTERS.map(({ key, label }) => (
                <option key={key} value={key}>
                  {t(label, { defaultValue: label })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("Name", { defaultValue: "Name" })}</th>
              <th>{t("Phone", { defaultValue: "Phone" })}</th>
              <th>{t("Role", { defaultValue: "Role" })}</th>
              <th>{t("Status", { defaultValue: "Status" })}</th>
              <th>{t("Actions", { defaultValue: "Actions" })}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  {t("Loading", { defaultValue: "Loading..." })}
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  {records.length === 0
                    ? t("NoStaff", { defaultValue: "No active staff found" })
                    : t("NoMatchingRecords", { defaultValue: "No matching records found" })}
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, idx) => (
                <tr key={record.staffId}>
                  <td>{idx + 1}</td>
                  <td className="font-medium">{record.fullName}</td>
                  <td>{record.phone}</td>
                  <td>{record.employmentType || "—"}</td>
                  <td>
                    {!record.status ? (
                      <span className="erp-badge erp-badge-neutral">{t("Unmarked", { defaultValue: "Unmarked" })}</span>
                    ) : record.status === "present" ? (
                      <span className="erp-badge erp-badge-success">{t("Present", { defaultValue: "Present" })}</span>
                    ) : record.status === "absent" ? (
                      <span className="erp-badge erp-badge-danger">{t("Absent", { defaultValue: "Absent" })}</span>
                    ) : (
                      <span className="erp-badge erp-badge-warning">{t("Leave", { defaultValue: "Leave" })}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      <button
                        type="button"
                        className={`attendance-btn ${record.status === "present" ? "active-present" : ""}`}
                        onClick={() => updateStatus(record.staffId, "present")}
                        disabled={saving === record.staffId}
                      >
                        {t("Present", { defaultValue: "Present" })}
                      </button>
                      <button
                        type="button"
                        className={`attendance-btn ${record.status === "absent" ? "active-absent" : ""}`}
                        onClick={() => updateStatus(record.staffId, "absent")}
                        disabled={saving === record.staffId}
                      >
                        {t("Absent", { defaultValue: "Absent" })}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
