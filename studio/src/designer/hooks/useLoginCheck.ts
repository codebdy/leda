import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../../consts";
import { useEntix, useToken } from "../../enthooks";

export function useLoginCheck() {
  const navigate = useNavigate();
  const entix = useEntix();
  const token = useToken()

  useEffect(() => {
    if (entix?.tokenName && !token) {
      navigate(LOGIN_URL);
    }
  }, [entix, token, navigate])
}