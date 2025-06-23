"use client";

// import dynamic from "next/dynamic";

import ClientHeader from "../../../components/ClientDashboardComponents/ClientHeader";
import ImportantNotify from "../../../components/ClientDashboardComponents/ImportantNotify";
import ProjectStatistics from "../../../components/ClientDashboardComponents/ProjectStatistics";
import OngoingProjects from "../../../components/ClientDashboardComponents/OngoingProjects";
import ProjectAndMessage from "../../../components/ClientDashboardComponents/ProjectAndMessage";
// import YourProjectLocations from "../../../components/ClientDashboardComponents/YourProjectLocations";

import { useRecoilState } from "recoil";
import { currentUserState } from "../../../atoms/userAtom";
import {
  fetchAllProjectType,
  verifySessionRoute,
} from "../../../utils/ApiRoutes";
// import { verifyPilotAuth } from "../../../utils/verifyAuth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import Link from "next/link";

import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export default function Home() {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [currentProjects, setCurrentProjects] = useState([]);
  const router = useRouter();

  const fetchUserProjects = async (id) => {
    const flattenedIds = id.flat();
    const { data } = await axios.post(fetchAllProjectType, {
      id: flattenedIds,
    });
    if (data?.status) {
      setCurrentProjects(data?.project);
      // console.log("Current Project : ", currentProjects);
    }
  };

  // useEffect(() => {
  //   console.log("hello");
  //   const fetchUser = async () => {
  //     const token = cookies.get("auth");
  //     if (!token) {
  //       router.push("/");
  //       return;
  //     }

  //     try {
  //       const data = await verifyPilotAuth({ setCurrentUser, token });

  //       if (!data) {
  //         router.push("/");
  //         return;
  //       }

  //       setCurrentUser(data);
  //     } catch (error) {
  //       console.error("Auth verification failed:", error);
  //       router.push("/");
  //     }
  //   };

  //   fetchUser();
  // }, [router, setCurrentUser]);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const auth = cookies.get("auth");
        // console.log("auth : ", auth);
        if (!auth) {
          router.push("/");
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
        }
      } catch (error) {
        cookies.remove("auth");
        console.error("Error verifying session:", error);
      }
    };
    verifySession();
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      fetchUserProjects([
        currentUser?.projectsId,
        currentUser?.solarProjectsId,
        currentUser?.towerProjectsId,
      ]);
    }
  }, [currentUser]);

  return (
    <div className="w-full bg-gray-50 overflow-y-auto">
      <ClientHeader />
      {currentUser?.clientIndustry?.includes("Drone Service Provider") ? (
        <div className="w-full flex items-center justify-end md:px-8 px-4 pt-5">
          <Link href={`/clientSpecial/${currentUser?.name}/newproject`}>
            <button
              className="bg-blue-600 hover:bg-blue-500 transition-all duration-200 ease-in-out 
					flex items-center gap-2 
					rounded-lg border-[1px] text-white border-gray-300 px-3 py-2"
            >
              <AiOutlinePlusCircle className="h-4 w-4" />
              New Project
            </button>
          </Link>
        </div>
      ) : (
        <ImportantNotify />
      )}
      <ProjectStatistics
        currentProjects={currentProjects}
        setCurrentProjects={setCurrentProjects}
      />
      <ProjectAndMessage
        currentProjects={currentProjects}
        setCurrentProjects={setCurrentProjects}
      />
      <OngoingProjects
        currentProjects={currentProjects}
        setCurrentProjects={setCurrentProjects}
      />
      {/*<YourProjectLocations currentProjects={currentProjects}
						setCurrentProjects={setCurrentProjects} />*/}

      <div className="mt-10 w-full md:px-8 px-4">
        <h1 className="text-lg text-center text-gray-500">
          © 2023{" "}
          <a
            href="https://aero2astro.com/"
            target="blank"
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Aero2Astro
          </a>
        </h1>
      </div>
    </div>
  );
}
