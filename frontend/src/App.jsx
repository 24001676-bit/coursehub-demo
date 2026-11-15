import { useEffect, useState } from "react";
import { api } from "./api.js";
import Notice from "./components/Notice.jsx";
import SectionTable from "./components/SectionTable.jsx";
import EnrollmentList from "./components/EnrollmentList.jsx";
import StudentForm from "./components/StudentForm.jsx";
import EnrollmentHistory from "./components/EnrollmentHistory.jsx";

export default function App() {
  const [draftId, setDraftId] = useState("22000004");
  const [studentId, setStudentId] = useState("22000004");
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState({ kind: "info", text: "" });
  const [refresh, setRefresh] = useState(0);
  const [courseCode, setCourseCode] = useState("");
  const [historyRows, setHistoryRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyPage, setHistoryPage] = useState(0);
  const HISTORY_PAGE_SIZE = 5;
  const CATALOG_PAGE_SIZE = 2;
  const [catalogRows, setCatalogRows] = useState([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [courseData, sectionData, enrollmentData] = await Promise.all([
          api("/courses", options),
          api("/sections", options),
          api(
            `/students/${encodeURIComponent(studentId)}/enrollments`,
            options,
          ),
        ]);
        if (controller.signal.aborted) return;
        setCourses(courseData);
        setSections(sectionData);
        setEnrollments(enrollmentData);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
        setCourses([]);
        setSections([]);
        setEnrollments([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [studentId, refresh]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError("");

      try {
        const skip = historyPage * HISTORY_PAGE_SIZE;

        const data = await api(
          `/enrollment-events?student_id=${encodeURIComponent(studentId)}&skip=${skip}&limit=${HISTORY_PAGE_SIZE}`,
          { signal: controller.signal },
        );

        if (controller.signal.aborted) return;

        setHistoryRows(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setHistoryError(err.message);
        setHistoryRows([]);
      } finally {
        if (!controller.signal.aborted) {
          setHistoryLoading(false);
        }
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [studentId, historyPage, refresh]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError("");

      try {
        const skip = catalogPage * CATALOG_PAGE_SIZE;
        const params = new URLSearchParams({
          skip: String(skip),
          limit: String(CATALOG_PAGE_SIZE),
        });

        if (catalogSearch.trim()) {
          params.set("q", catalogSearch.trim());
        }

        const data = await api(`/courses?${params.toString()}`, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setCatalogRows(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setCatalogError(err.message);
        setCatalogRows([]);
      } finally {
        if (!controller.signal.aborted) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();

    return () => controller.abort();
  }, [catalogPage, catalogSearch]);

  function chooseStudent(event) {
    event.preventDefault();
    const nextId = draftId.trim();
    if (!/^\d{8}$/.test(nextId)) {
      setNotice({ kind: "error", text: "Mã demo phải gồm 8 chữ số." });
      return;
    }
    setNotice({ kind: "info", text: "" });
    setLoading(true);
    setStudentId(nextId);
    setRefresh((value) => value + 1);
  }

  async function changeEnrollment(sectionId, cancel = false) {
    if (busy || loading || error) return;
    if (cancel && !window.confirm(`Hủy đăng ký lớp ${sectionId}?`)) return;

    setBusy(true);
    setNotice({ kind: "info", text: "Đang gửi yêu cầu..." });

    try {
      if (cancel) {
        await api(
          `/enrollments/${encodeURIComponent(studentId)}/${encodeURIComponent(sectionId)}`,
          { method: "DELETE" },
        );
      } else {
        await api("/enrollments", {
          method: "POST",
          body: { student_id: studentId, class_section_id: sectionId },
        });
      }
      setNotice({
        kind: "success",
        text: cancel
          ? `Đã hủy đăng ký ${sectionId}.`
          : `Đăng ký ${sectionId} thành công.`,
      });
    } catch (err) {
      setNotice({ kind: "error", text: err.message });
    } finally {
      setLoading(true);
      setRefresh((value) => value + 1);
      setBusy(false);
    }
  }
  const allowedCourseCodes = ["INT2204", "INT2205", "INT2206"];

  const filterCourses = courses.filter((course) =>
    allowedCourseCodes.includes(course.code),
  );
  const keyword = search.trim().toLowerCase();
  const rows = sections
    .map((section) => ({
      ...section,
      course_name:
        courses.find((course) => course.code === section.course_code)?.name ??
        section.course_code,
      registered: enrollments.some(
        (item) => item.class_section_id === section.class_id,
      ),
    }))
    .filter(
      (row) =>
        `${row.class_id} ${row.course_code} ${row.course_name}`
          .toLowerCase()
          .includes(keyword) &&
        (!onlyAvailable || row.remaining > 0) &&
        (!courseCode || row.course_code === courseCode),
    );
  const disabled = loading || busy || Boolean(error);

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">CSDL WEB VÀ HỆ THỐNG THÔNG TIN - BUỔI 5</p>
        <h1>CourseHub</h1>
        <p>Tra cứu và đăng ký lớp học phần</p>
        <span className="chip">React - FastAPI - PostgreSQL</span>
      </header>

      <p className="demo-note">
        Môi trường thực hành. Nhập mã sinh viên để thử dữ liệu, không phải đăng
        nhập.
      </p>

      <StudentForm
        draftId={draftId}
        studentId={studentId}
        busy={busy}
        loading={loading}
        onDraftChange={setDraftId}
        onSubmit={chooseStudent}
        onReload={() => setRefresh((value) => value + 1)}
      />

      <Notice kind={notice.kind}>{notice.text}</Notice>
      <Notice kind="error">{error}</Notice>
      {loading && <Notice>Đang tải dữ liệu từ API...</Notice>}

      {!loading && !error && (
        <div className="workspace">
          <section className="panel">
            <h2>2. Danh sách lớp học phần</h2>
            <div className="filters">
              <label htmlFor="search">Tìm lớp học phần</label>
              <input
                id="search"
                value={search}
                placeholder="Ví dụ: web"
                onChange={(e) => setSearch(e.target.value)}
              />
              <label htmlFor="course-filter">Lọc theo môn học</label>

              <select
                id="course-filter"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              >
                <option value="">Tất cả môn học</option>

                {filterCourses.map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              {/* KẾT THÚC ĐOẠN MỚI */}
              <label className="check">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Chỉ hiện lớp còn chỗ
              </label>
            </div>
            <SectionTable
              rows={rows}
              disabled={disabled}
              onEnroll={(id) => changeEnrollment(id)}
            />
          </section>

          <section className="panel">
            <h2>3. Lớp đã đăng ký</h2>
            <p className="muted">
              Sinh viên {studentId} ({enrollments.length} lớp)
            </p>
            <EnrollmentList
              rows={enrollments}
              disabled={disabled}
              onCancel={(id) => changeEnrollment(id, true)}
            />
          </section>
        </div>
      )}
      <EnrollmentHistory
        rows={historyRows}
        loading={historyLoading}
        error={historyError}
        page={historyPage}
        onPrevious={() => setHistoryPage((page) => Math.max(0, page - 1))}
        onNext={() => setHistoryPage((page) => page + 1)}
      />
      <section className="panel">
        <h2>5. Danh mục học phần (Server-side)</h2>

        <input
          type="text"
          placeholder="Tìm theo mã hoặc tên học phần..."
          value={catalogSearch}
          onChange={(e) => {
            setCatalogSearch(e.target.value);
            setCatalogPage(0);
          }}
        />

        {catalogLoading && <p>Đang tải học phần...</p>}

        {catalogError && <p className="error">{catalogError}</p>}

        {!catalogLoading && !catalogError && catalogRows.length === 0 && (
          <p>Không tìm thấy học phần phù hợp.</p>
        )}

        {!catalogLoading && !catalogError && catalogRows.length > 0 && (
          <>
            <div>
              {catalogRows.map((course) => (
                <div key={course.code}>
                  <strong>{course.code}</strong>
                  {" - "}
                  {course.name}
                  <p>Số tín chỉ: {course.credits}</p>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                type="button"
                onClick={() => setCatalogPage((page) => Math.max(0, page - 1))}
                disabled={catalogPage === 0 || catalogLoading}
              >
                Trang trước
              </button>

              <span>Trang {catalogPage + 1}</span>

              <button
                type="button"
                onClick={() => setCatalogPage((page) => page + 1)}
                disabled={
                  catalogRows.length < CATALOG_PAGE_SIZE || catalogLoading
                }
              >
                Trang sau
              </button>
            </div>
          </>
        )}
      </section>

      <footer>
        Số chỗ và đăng ký được đọc từ API; Backend quyết định tính hợp lệ.
      </footer>
    </main>
  );
}
