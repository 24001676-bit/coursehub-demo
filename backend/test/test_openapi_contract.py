
from backend.app.main import app


def test_required_api_paths_and_methods():
    """Kiểm tra các API endpoint quan trọng được khai báo trong OpenAPI."""

    schema = app.openapi()
    paths = schema["paths"]

    expected_endpoints = {
        "/health": ["get"],
        "/courses": ["get"],
        "/sections": ["get"],
        "/students/{student_id}/enrollments": ["get"],
        "/enrollments": ["post"],
        "/enrollments/{student_id}/{class_section_id}": ["delete"],
        "/enrollment-events": ["get"],
    }

    for path, methods in expected_endpoints.items():
        assert path in paths, f"Missing API endpoint: {path}"

        for method in methods:
            assert method in paths[path], (
                f"Missing method {method.upper()} for {path}"
            )


def test_enrollment_success_status_codes():
    """Kiểm tra mã HTTP thành công của API đăng ký và hủy đăng ký."""

    schema = app.openapi()
    paths = schema["paths"]

    assert "201" in paths["/enrollments"]["post"]["responses"]

    assert "204" in paths[
        "/enrollments/{student_id}/{class_section_id}"
    ]["delete"]["responses"]
