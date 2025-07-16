import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified legal page with terms section
    navigate("/legal#terms", { replace: true });
  }, [navigate]);

  return null;
}
