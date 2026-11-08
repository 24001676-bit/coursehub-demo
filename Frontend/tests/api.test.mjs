import test from "node:test";
import assert from "node:assert/strict";

import { api } from "../src/api.js";

// Tạo phản hồi giả giống Response của fetch.
function mockResponse(status, data) {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => (data === null ? "" : JSON.stringify(data)),
  };
}

// Thay fetch thật bằng fetch giả trong từng bài kiểm thử.
async function withMockFetch(mockFetch, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;

  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// 1. Kiểm tra GET lấy dữ liệu thành công.
test("GET trả về dữ liệu JSON", async () => {
  await withMockFetch(
    async () => mockResponse(200, [{ id: 1, name: "Java" }]),
    async () => {
      const result = await api("/courses");

      assert.deepEqual(result, [{ id: 1, name: "Java" }]);
    },
  );
});

// 2. Kiểm tra POST gửi đúng phương thức và JSON body.
test("POST gửi dữ liệu JSON", async () => {
  await withMockFetch(
    async (url, options) => {
      assert.ok(url.endsWith("/enrollments"));
      assert.equal(options.method, "POST");
      assert.equal(options.headers["Content-Type"], "application/json");
      assert.deepEqual(JSON.parse(options.body), {
        student_id: "22000004",
        class_section_id: "WEB-01",
      });

      return mockResponse(201, { id: 10, status: "enrolled" });
    },
    async () => {
      const result = await api("/enrollments", {
        method: "POST",
        body: {
          student_id: "22000004",
          class_section_id: "WEB-01",
        },
      });

      assert.equal(result.id, 10);
    },
  );
});

// 3. Kiểm tra DELETE với HTTP 204 không có response body.
test("DELETE 204 trả về null", async () => {
  await withMockFetch(
    async () => mockResponse(204, null),
    async () => {
      const result = await api("/enrollments/22000004/WEB-01", {
        method: "DELETE",
      });

      assert.equal(result, null);
    },
  );
});

// 4. Kiểm tra các lỗi HTTP 404 và 409.
test("HTTP 404 và 409 tạo lỗi có status tương ứng", async () => {
  for (const status of [404, 409]) {
    await withMockFetch(
      async () => mockResponse(status, { detail: "Có lỗi xảy ra" }),
      async () => {
        await assert.rejects(api("/test"), (error) => {
          assert.equal(error.status, status);
          assert.match(error.message, new RegExp(`HTTP ${status}`));
          return true;
        });
      },
    );
  }
});

// 5. Kiểm tra lỗi validation 422 dạng danh sách.
test("HTTP 422 hiển thị các lỗi validation", async () => {
  await withMockFetch(
    async () =>
      mockResponse(422, {
        detail: [{ msg: "Field required" }, { msg: "Invalid value" }],
      }),
    async () => {
      await assert.rejects(
        api("/enrollments"),
        /Field required; Invalid value/,
      );
    },
  );
});

// 6. Kiểm tra khi Backend trả về nội dung không phải JSON.
test("Phản hồi không phải JSON tạo lỗi", async () => {
  await withMockFetch(
    async () => ({
      status: 500,
      ok: false,
      text: async () => "<html>Server Error</html>",
    }),
    async () => {
      await assert.rejects(api("/test"), /không phải JSON/);
    },
  );
});

// 7. Kiểm tra khi không kết nối được Backend.
test("Lỗi kết nối được chuyển thành thông báo dễ hiểu", async () => {
  await withMockFetch(
    async () => {
      throw new TypeError("Failed to fetch");
    },
    async () => {
      await assert.rejects(api("/courses"), /Không nhận được phản hồi API/);
    },
  );
});

// 8. Kiểm tra AbortError được giữ nguyên.
test("AbortError được ném lại, không đổi thành lỗi kết nối", async () => {
  const abortError = new Error("Request aborted");
  abortError.name = "AbortError";

  await withMockFetch(
    async () => {
      throw abortError;
    },
    async () => {
      await assert.rejects(api("/courses"), (error) => error === abortError);
    },
  );
});
