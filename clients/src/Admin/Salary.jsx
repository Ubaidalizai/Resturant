import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Salary() {
  const { get, put } = useApi();
  const { t } = useTranslation("common");
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ paymentMethod: "Cash", paymentDate: "", notes: "" });
  const [editForm, setEditForm] = useState({ overtime: 0, extraDeduction: 0, debt: 0, notes: "" });
  const [revertReason, setRevertReason] = useState("");
  const { confirmState, openConfirm, closeConfirm, handleConfirm } = useConfirmModel();

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await get(`/api/v1/salary/all?month=${month}&year=${year}`);
      setSalaries(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [month, year]);

  const openPayModal = (salary) => {
    setSelectedSalary(salary);
    setPaymentForm({
      paymentMethod: salary.paymentMethod || "Cash",
      paymentDate: salary.paymentDate ? new Date(salary.paymentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      notes: salary.notes || "",
    });
    setShowPayModal(true);
  };

  const openRevertModal = (salary) => {
    setSelectedSalary(salary);
    setRevertReason("");
    setShowRevertModal(true);
  };

  const openEditModal = (salary) => {
    setSelectedSalary(salary);
    setEditForm({
      overtime: salary.overtime || 0,
      extraDeduction: salary.extraDeduction || 0,
      debt: salary.staffId?.debt ?? 0,
      notes: salary.notes || "",
    });
    setShowEditModal(true);
  };

  const openProfile = async (salary) => {
    const staffId = salary?.staffId?._id;
    if (!staffId) return;
    setShowProfileModal(true);
    setProfileLoading(true);
    try {
      const res = await get(`/api/v1/salary/profile/${staffId}?preset=monthly&month=${month}&year=${year}`);
      setProfile(res.data.data || null);
    } catch (err) {
      console.error(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed"));
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePay = () => {
    if (!selectedSalary) return;
    openConfirm({
      title: t("ConfirmPayment"),
      message: t("ConfirmPaymentMessage", { name: selectedSalary.staffId?.fullName, amount: selectedSalary.finalSalary?.toLocaleString() }),
      onConfirm: async () => {
        try {
          await put(`/api/v1/salary/pay/${selectedSalary._id}`, paymentForm);
          toast.success(t("SalaryPaid"));
          setShowPayModal(false);
          fetchSalaries();
        } catch (err) {
          toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed"));
        }
      },
    });
  };

  const handleRevert = async () => {
    if (!selectedSalary) return;
    if (!revertReason.trim() || revertReason.trim().length < 5) {
      toast.error(t("RevertReasonRequired"));
      return;
    }
    try {
      await put(`/api/v1/salary/revert/${selectedSalary._id}`, { reason: revertReason.trim() });
      toast.success(t("SalaryReverted"));
      setShowRevertModal(false);
      fetchSalaries();
    } catch (err) {
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed"));
    }
  };

  const handleEditSave = async () => {
    if (!selectedSalary) return;
    try {
      await put(`/api/v1/salary/update/${selectedSalary._id}`, editForm);
      toast.success(t("UpdatedSuccessfully"));
      setShowEditModal(false);
      fetchSalaries();
    } catch (err) {
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed"));
    }
  };

  const filtered = salaries.filter((s) => {
    const name = s.staffId?.fullName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPending = filtered.filter((s) => s.status === "Pending").reduce((sum, s) => sum + s.finalSalary, 0);
  const totalPaid = filtered.filter((s) => s.status === "Paid").reduce((sum, s) => sum + s.finalSalary, 0);

  return (
    <div className="space-y-4">
      <div className="erp-panel p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-end">
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="erp-label">{t("Month")}</label>
              <select className="erp-select w-36" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{t(`Month${i + 1}`, { defaultValue: m })}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="erp-label">{t("Year")}</label>
              <select className="erp-select w-28" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="erp-label">{t("Search")}</label>
              <input
                type="text"
                className="erp-input w-48"
                placeholder={t("SearchByName")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("TotalRecords")}</div>
            <div className="erp-stat-value">{filtered.length}</div>
          </div>
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("PendingSalaries")}</div>
            <div className="erp-stat-value text-amber-600">${totalPending.toLocaleString()}</div>
          </div>
          <div className="erp-stat-card">
            <div className="erp-stat-label">{t("PaidSalaries")}</div>
            <div className="erp-stat-value text-green-600">${totalPaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th>{t("Name")}</th>
              <th>{t("BaseSalary")}</th>
              <th>{t("Present")}</th>
              <th>{t("Absent")}</th>
              <th>{t("Deduction")}</th>
              <th>{t("Overtime")}</th>
              <th>{t("FinalSalary")}</th>
              <th>{t("Status")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="text-center py-8 text-slate-500">{t("Loading")}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-slate-500">{t("NoSalaryRecords")}</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id}>
                  <td
                    className="font-medium text-blue-700 hover:underline cursor-pointer"
                    onClick={() => openProfile(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openProfile(item)}
                  >
                    {item.staffId?.fullName || "—"}
                  </td>
                  <td>${item.baseSalary?.toLocaleString()}</td>
                  <td>{item.presentDays}</td>
                  <td>{item.absentDays}</td>
                  <td>${((item.attendanceDeduction || 0) + (item.extraDeduction || 0) + (item.debtDeduction || 0)).toLocaleString()}</td>
                  <td>${(item.overtime || 0).toLocaleString()}</td>
                  <td className="font-semibold">${item.finalSalary?.toLocaleString()}</td>
                  <td>
                    <span className={`erp-badge ${item.status === "Paid" ? "erp-badge-success" : "erp-badge-warning"}`}>
                      {item.status === "Paid" ? t("Paid") : t("Pending")}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {item.status === "Pending" && (
                        <button type="button" className="btn-primary text-xs px-2 py-1" onClick={() => openPayModal(item)}>
                          {t("Pay")}
                        </button>
                      )}
                      {item.status === "Paid" && (
                        <button type="button" className="btn-secondary text-xs px-2 py-1" onClick={() => openRevertModal(item)}>
                          {t("RevertToPending")}
                        </button>
                      )}
                      {item.status === "Pending" && (
                        <button type="button" className="btn-secondary text-xs px-2 py-1" onClick={() => openEditModal(item)}>
                          <AiOutlineEdit size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPayModal && selectedSalary && (
        <div className="modal-backdrop">
          <div className="modal-card modal-card-md p-6 w-full">
            <h3 className="erp-page-title mb-4">{t("PaySalary")}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {selectedSalary.staffId?.fullName} — <strong>${selectedSalary.finalSalary?.toLocaleString()}</strong>
            </p>
            {(selectedSalary.staffId?.debt > 0) && (
              <p className="text-sm text-amber-700 mb-4">
                {t("LoanAdvance", { defaultValue: "Loan/Advance" })}: ${Number(selectedSalary.staffId.debt).toLocaleString()} ({t("DeductedOnPayment", { defaultValue: "deducted on payment" })})
              </p>
            )}
            <div className="space-y-3">
              <div>
                <label className="erp-label">{t("PaymentMethod")}</label>
                <select className="erp-select" value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}>
                  <option value="Cash">{t("Cash")}</option>
                  <option value="Bank Transfer">{t("BankTransfer")}</option>
                  <option value="Mobile Money">{t("MobileMoney")}</option>
                </select>
              </div>
              <div>
                <label className="erp-label">{t("PaymentDate")}</label>
                <input type="date" className="erp-input" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })} />
              </div>
              <div>
                <label className="erp-label">{t("Notes")}</label>
                <textarea className="erp-input" rows={3} value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn-secondary" onClick={() => setShowPayModal(false)}>{t("Cancel")}</button>
              <button type="button" className="btn-primary" onClick={handlePay}>{t("Confirm", { defaultValue: "Confirm" })}</button>
            </div>
          </div>
        </div>
      )}

      {showRevertModal && selectedSalary && (
        <div className="modal-backdrop">
          <div className="modal-card modal-card-md p-6 w-full">
            <h3 className="erp-page-title mb-4">{t("RevertToPending")}</h3>
            <p className="text-sm text-slate-600 mb-2">{t("RevertSalaryWarning")}</p>
            <p className="text-sm font-medium mb-4">
              {selectedSalary.staffId?.fullName} — ${selectedSalary.finalSalary?.toLocaleString()}
            </p>
            <div>
              <label className="erp-label">{t("RevertReason")}</label>
              <textarea
                className="erp-input"
                rows={3}
                value={revertReason}
                onChange={(e) => setRevertReason(e.target.value)}
                placeholder={t("RevertReasonPlaceholder")}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn-secondary" onClick={() => setShowRevertModal(false)}>{t("Cancel")}</button>
              <button type="button" className="btn-danger" onClick={handleRevert}>{t("ConfirmRevert")}</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedSalary && (
        <div className="modal-backdrop">
          <div className="modal-card modal-card-md p-6 w-full">
            <h3 className="erp-page-title mb-4">{t("EditSalary")}</h3>
            <p className="text-sm text-slate-600 mb-4">{selectedSalary.staffId?.fullName}</p>
            <div className="space-y-3">
              <div>
                <label className="erp-label">{t("Overtime")}</label>
                <input type="number" className="erp-input" value={editForm.overtime} onChange={(e) => setEditForm({ ...editForm, overtime: e.target.value })} />
              </div>
              <div>
                <label className="erp-label">{t("ExtraDeduction")}</label>
                <input type="number" className="erp-input" value={editForm.extraDeduction} onChange={(e) => setEditForm({ ...editForm, extraDeduction: e.target.value })} />
              </div>
              <div>
                <label className="erp-label">{t("EmployeeDebt", { defaultValue: "Employee Debt" })}</label>
                <input type="number" className="erp-input" value={editForm.debt} onChange={(e) => setEditForm({ ...editForm, debt: e.target.value })} />
                <div className="text-xs text-slate-500 mt-1">
                  {t("EmployeeDebtHelp", { defaultValue: "Debt is shown only in profile and deducted when salary is paid." })}
                </div>
              </div>
              <div>
                <label className="erp-label">{t("Notes")}</label>
                <textarea className="erp-input" rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>{t("Cancel")}</button>
              <button type="button" className="btn-primary" onClick={handleEditSave}>{t("Save")}</button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card modal-card-lg p-6 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="erp-page-title">{t("EmployeeSalaryProfile", { defaultValue: "Employee Salary Profile" })}</h3>
                <p className="text-sm text-slate-600">{profile?.staff?.fullName || selectedSalary?.staffId?.fullName}</p>
              </div>
              <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>{t("Close")}</button>
            </div>

            {profileLoading ? (
              <div className="text-center py-10 text-slate-500">{t("Loading")}</div>
            ) : !profile ? (
              <div className="text-center py-10 text-slate-500">{t("NoData", { defaultValue: "No data" })}</div>
            ) : (
              <div className="space-y-4">
                <div className="erp-panel p-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-slate-500">{t("Phone")}: </span><span className="font-medium">{profile.staff.phone || "—"}</span></div>
                    <div><span className="text-slate-500">{t("Address")}: </span><span className="font-medium">{profile.staff.address || "—"}</span></div>
                    <div><span className="text-slate-500">{t("NationalId")}: </span><span className="font-medium">{profile.staff.nationalId || "—"}</span></div>
                    <div><span className="text-slate-500">{t("Salary")}: </span><span className="font-medium">${Number(profile.staff.salary || 0).toLocaleString()}</span></div>
                    <div><span className="text-slate-500">{t("EmploymentType")}: </span><span className="font-medium">{profile.staff.employmentType || "—"}</span></div>
                    <div><span className="text-slate-500">{t("Status")}: </span><span className="font-medium">{profile.staff.status || "—"}</span></div>
                    <div><span className="text-slate-500">{t("EmployeeDebt", { defaultValue: "Employee Debt" })}: </span><span className="font-semibold text-red-600">${Number(profile.debt || 0).toLocaleString()}</span></div>
                    <div><span className="text-slate-500">{t("TotalDeduction", { defaultValue: "Total Deduction" })}: </span><span className="font-semibold text-amber-600">${Number(profile.totalDeduction || 0).toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="erp-panel p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">{t("AttendanceSummary", { defaultValue: "Attendance Summary" })}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="erp-stat-card"><div className="erp-stat-label">{t("Present")}</div><div className="erp-stat-value text-green-600">{profile.attendanceSummary.present}</div></div>
                    <div className="erp-stat-card"><div className="erp-stat-label">{t("Absent")}</div><div className="erp-stat-value text-red-600">{profile.attendanceSummary.absent}</div></div>
                    <div className="erp-stat-card"><div className="erp-stat-label">{t("Total")}</div><div className="erp-stat-value">{profile.attendanceSummary.total}</div></div>
                  </div>
                </div>

                <div className="erp-panel p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">{t("SalaryHistory", { defaultValue: "Salary History" })}</h4>
                  <div className="erp-table-wrap">
                    <table className="erp-table">
                      <thead>
                        <tr>
                          <th>{t("Month")}</th>
                          <th>{t("Year")}</th>
                          <th>{t("BaseSalary")}</th>
                          <th>{t("Salary", { defaultValue: "Salary" })}</th>
                          <th>{t("LoanAdvance", { defaultValue: "Loan/Advance" })}</th>
                          <th>{t("Deduction")}</th>
                          <th>{t("FinalSalary")}</th>
                          <th>{t("Status")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(profile.salaryHistory || []).length === 0 ? (
                          <tr><td colSpan={8} className="text-center py-8 text-slate-500">{t("NoSalaryRecords")}</td></tr>
                        ) : (
                          (profile.salaryHistory || []).map((s) => (
                            <tr key={s._id}>
                              <td>{s.month}</td>
                              <td>{s.year}</td>
                              <td>${Number(s.baseSalary || 0).toLocaleString()}</td>
                              <td>${Number(s.grossSalary || s.finalSalary || 0).toLocaleString()}</td>
                              <td>${Number(s.loanAdvance ?? s.debtDeduction ?? 0).toLocaleString()}</td>
                              <td>${Number(s.combinedDeduction ?? ((s.attendanceDeduction || 0) + (s.extraDeduction || 0) + (s.debtDeduction || 0))).toLocaleString()}</td>
                              <td className="font-semibold">${Number(s.finalSalary || 0).toLocaleString()}</td>
                              <td><span className={`erp-badge ${s.status === "Paid" ? "erp-badge-success" : "erp-badge-warning"}`}>{s.status === "Paid" ? t("Paid") : t("Pending")}</span></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModel
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
          confirmText={t("Confirm", { defaultValue: "Confirm" })}
          confirmVariant="primary"
        />
    </div>
  );
}
