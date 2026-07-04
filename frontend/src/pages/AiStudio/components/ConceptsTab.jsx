import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import apiEndpoints from "../../../api/apiEndpoint";
import StudyStateWrapper from "./StudyStateWrapper";

export default function ConceptsTab({ fileId, getToken }) {
  const [concepts, setConcepts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchConcepts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await axios.get(apiEndpoints.GET_AI_CONCEPTS(fileId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConcepts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải khái niệm AI:", err);
      setError(err.response?.data?.message || "Không thể tạo danh sách khái niệm cho tài liệu này.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchConcepts();
  }, []);

  return (
    <div className="p-6">
      <StudyStateWrapper loading={loading} error={error} onRetry={fetchConcepts}>
        {concepts?.concepts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {concepts.concepts.map((c, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <h4 className="text-sm font-extrabold text-indigo-600 mb-1">{c.term}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{c.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">Chưa có khái niệm nào.</p>
        )}
      </StudyStateWrapper>
    </div>
  );
}