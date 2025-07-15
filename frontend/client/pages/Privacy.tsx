import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified legal page with privacy section
    navigate("/legal#privacy", { replace: true });
  }, [navigate]);

  return null;
}
