export default function EnrollmentHistory({
  rows,
  loading,
  error,
  page,
  onPrevious,
  onNext,
}) {
  return (
    <section className="panel">
      <h2>4. Lịch sử đăng ký học phần</h2>

      {loading && <p>Đang tải lịch sử...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p>Chưa có lịch sử đăng ký.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <div>
            {rows.map((event) => (
              <div key={event.id}>
                <strong>{event.class_section_id}</strong>
                {" - "}
                {event.event_type}
                <p>{event.occurred_at}</p>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              onClick={onPrevious}
              disabled={page === 0 || loading}
            >
              Trang trước
            </button>

            <span>Trang {page + 1}</span>

            <button
              type="button"
              onClick={onNext}
              disabled={rows.length < 5 || loading}
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </section>
  );
}
