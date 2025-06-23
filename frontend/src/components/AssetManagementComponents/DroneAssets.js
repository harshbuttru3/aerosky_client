"use client";

import { AiOutlineSearch, AiOutlineCamera } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { BsFillPersonFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { getDrones, createDrone } from "../../utils/ApiRoutes";
import axios from "axios";
import ImageKit from "imagekit";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function DroneAssets() {
  const [drones, setDrones] = useState([]);
  const [url, setUrl] = useState("");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [openDroneCreateTab, setOpenDroneCreateTab] = useState(false);

  useEffect(() => {
    getAllDronesFunc();
  }, []);

  var imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_ID,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
  });

  const pathCheck = (path) => {
    if (path) {
      if (path.split(".").includes("jpg")) {
        return true;
      } else if (path.split(".").includes("jpeg")) {
        return true;
      } else if (path.split(".").includes("png")) {
        return true;
      }
    }
  };

  const urlSetter = (pathImage) => {
    const image_input = document.querySelector("#file1");
    if (image_input && pathCheck(pathImage)) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        let uploaded_image = reader.result;
        setUrl(uploaded_image);
      });
      reader.readAsDataURL(image_input.files[0]);
    }
  };

  const getAllDronesFunc = async () => {
    setDrones([]);
    console.log("i ran");
    const { data } = await axios.post(getDrones, {
      key: "qpDmo5oe2IMPB7RG0g==",
    });
    if (data?.status) {
      setDrones(data?.drone.reverse());
    } else {
      console.log(data.msg);
    }
  };

  const uploadDrone = async (droneImage) => {
    const { data } = await axios.post(createDrone, {
      name,
      id,
      ownerName,
      image: droneImage,
      key: "qpDmo5oe2IMPB7RG0g==",
    });
    if (data.status) {
      setLoading(false);
      setOpenDroneCreateTab(false);
      getAllDronesFunc();
    } else {
      setOpenDroneCreateTab(false);
      setLoading(false);
      alert(data?.msg);
    }
  };

  const upload = () => {
    if (url.length > 2) {
      if (pathCheck(path)) {
        setLoading(true);
        // e.preventDefault();
        imagekit
          .upload({
            file: url, //required
            fileName: "thejashari", //required
            extensions: [
              {
                name: "google-auto-tagging",
                maxTags: 5,
                minConfidence: 95,
              },
            ],
          })
          .then((response) => {
            setImage(response.url);
            uploadDrone(response.url);
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        console.log("Please Select an Image");
      }
    }
  };

  const createDroneNow = async () => {
    if (
      name.length > 3 &&
      url.length > 3 &&
      id.length > 3 &&
      ownerName.length > 3
    ) {
      setLoading(true);
      upload();
    } else {
      alert("Please enter all the required fields");
      console.log(url, name, id, ownerName);
    }
  };

  return (
    <div className="w-full md:px-8 px-2">
      <div
        className={`fixed flex items-center justify-center top-0 ${
          openDroneCreateTab ? "left-0" : "-left-[100%]"
        } 
			transition-all duration-200 ease-in-out  bg-white/60 z-50 h-full w-full`}
      >
        <div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-lg overflow-y-auto border-[1px] border-gray-400/50 bg-white flex flex-col">
          <div
            className={`${
              !loading && "hidden"
            } fixed left-0 top-0 z-50 h-full w-full flex items-center justify-center bg-white/50`}
          >
            <span class="loader"></span>
          </div>
          <div
            className="flex sticky top-0 bg-white py-1 backdrop-blur-lg items-center 
					border-b-[1px] border-gray-300 gap-5 px-2"
          >
            <div
              onClick={() => {
                setOpenDroneCreateTab(false);
              }}
              className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full"
            >
              <IoMdClose className="h-5 w-5 cursor-pointer text-black " />
            </div>
            <h1 className="text-xl select-none text-black  font-semibold">
              Add drone
            </h1>
          </div>
          <div className="flex flex-col mt-3 px-4">
            <div className="flex gap-2">
              <div className="flex p-2 flex-col gap-2">
                <h1 className="text-md font-semibold text-black">
                  Upload avatar
                </h1>
                <div
                  onClick={() => document.getElementById("file1").click()}
                  className="h-[150px] w-[150px] hover:scale-105 transition-all duration-200
							ease-in-out flex items-center justify-center cursor-pointer border-dashed
							rounded-md border-[1.5px] border-sky-600 p-[2px] overflow-hidden"
                >
                  <input
                    type="file"
                    id="file1"
                    accept="image/*"
                    value={path}
                    onChange={(e) => {
                      setPath(e.target.value);
                      urlSetter(e.target.value);
                    }}
                    hidden
                  />
                  <Image
                    src={url ? url : "https://ik.imagekit.io"}
                    width="20000"
                    height="10"
                    object="cover"
                    alt=""
                    className={`rounded-md ${!url && "hidden"}`}
                  />
                  <AiOutlineCamera className="h-14 w-14 text-sky-500" />
                </div>
              </div>
              <div className="flex px-3 w-full py-2 border-l-[1px] border-gray-300 flex-col gap-2">
                <h1 className="text-md font-semibold text-black">
                  Drone details
                </h1>
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm text-gray-700 font-semibold">
                    Drone ID
                  </h1>
                  <div className="px-3 py-2 border-[1px] border-gray-600/60 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter drone id"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm text-gray-700 font-semibold">
                    Drone name
                  </h1>
                  <div className="px-3 py-2 border-[1px] border-gray-600/60 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter drone name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3">
              <div
                className="w-full flex items-center px-5 py-3 border-[1.3px] border-orange-500 
						rounded-lg mt-3 gap-5"
              >
                <BsFillPersonFill className="text-orange-500 h-7 w-7" />
                <input
                  type="text"
                  placeholder="Enter owner name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-transparent outline-none ring-none
							font-semibold text-lg text-black placeholder:text-gray-500 placeholder:font-normal placeholder:text-md"
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300 mt-3" />

            <button
              onClick={createDroneNow}
              className={`text-white py-3 mb-3 px-5 mt-3 hover:scale-[102%] transition-all 
					duration-200 ease-in-out rounded-lg bg-blue-700 `}
            >
              Add drone
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-1 p-3 px-4 bg-gray-200/60 rounded-lg flex flex-col">
        <div className="flex md:items-center md:flex-row flex-col justify-between gap-3 w-full">
          <div className="flex items-center gap-2 md:w-[70%] w-[100%] bg-white p-2 rounded-md">
            <AiOutlineSearch className="h-5 w-5 text-gray-700" />
            <input
              type="text"
              className="w-full outline-none bg-transparent 
						ring-none text-md text-black placeholder:text-gray-600"
              placeholder="Search drone"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenDroneCreateTab(true)}
              className="bg-blue-600 text-white px-8 py-2 hover:scale-105 transition-all
						duration-200 ease-in-out shadow-md shadow-gray-500/40 rounded-md"
            >
              Add drone
            </button>
            <button
              className="bg-blue-600 text-white p-2 hover:scale-105 transition-all
						duration-200 ease-in-out shadow-md shadow-gray-500/40 rounded-md"
            >
              <FiMenu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <h1 className="mt-4 text-black font-semibold text-lg">
          Available drones ({drones?.length})
        </h1>

        <div className="grid gap-3 mt-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {drones?.map((drone, j) => (
            <div
              key={j}
              className="bg-white flex items-center rounded-lg border-[1px] border-gray-400 
							px-3 py-[10px] cursor-pointer hover:bg-gray-100/20 transition-all duration-200 
							ease-in-out shadow-md shadow-gray-300/50 justify-between"
            >
              <div className="flex flex-col ">
                <h1 className="text-md text-black font-semibold">
                  {drone?.id}
                </h1>
                <p className="text-sm text-gray-500 font-normal">
                  {drone?.name}
                </p>
              </div>
              <div className="">
                <img src={drone?.image} className="w-[50px] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
