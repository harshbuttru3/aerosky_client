// frontend/src/utils/useAuthProtection.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { currentUserState } from "../atoms/userAtom";
import axios from "axios";
import Cookies from "universal-cookie";
import { verifySessionRoute } from "./ApiRoutes";

const cookies = new Cookies(null, { path: "/" });

export default function useAuthProtection() {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const auth = cookies.get("auth");
        if (!auth) {
          router.push("/");
          return;
        }
        const response = await axios.get(verifySessionRoute, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          withCredentials: true,
        });
        const { status, user } = response.data;
        if (status === true) {
          setCurrentUser(user);
        } else {
          cookies.remove("auth");
          router.push("/");
        }
      } catch (error) {
        cookies.remove("auth");
        router.push("/");
      }
    };
    // Only verify if user is not already set
    if (!currentUser) verifySession();
  }, [router, setCurrentUser, currentUser]);
}