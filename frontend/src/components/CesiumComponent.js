'use client';

import { Viewer, Entity, CameraFlyTo, ModelGraphics, CameraLookAt } from "resium";
import { Cartesian3, Transforms, Ion } from "cesium";
import {host} from '../utils/ApiRoutes';
import Script from 'next/script';
import "cesium/Build/Cesium/Widgets/widgets.css";
import Head from 'next/head'
// const kmlFile = 'https://ik.imagekit.io/d3kzbpbila/KML/lambo_5QcOqmhLk.glb?updatedAt=1719603333611'
// const kmlFile = 'http://192.168.1.7:3333/3dmodels/66770bee963361016bf4896f/gNUx7BrhD2-lambo.glb'
const kmlFile = '/audi.glb'
const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 0);
const cameraPosition = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 20);
const offset = Cartesian3.fromDegrees(0, 0, 0);

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZDA3MzVlYi1jYTgxLTQwYjQtOTY1MC1mMDczZDkxMWEwNDIiLCJpZCI6MjI1MjYzLCJpYXQiOjE3MTk2MDQwMDB9.KAOX9jlpA6O0Bwwyc6vrdpWMiQI527BFXO7Xb33YZYw'

export default function CesiumComponent({currentStore}) {
  console.log(host,currentStore,'sad');
  return (
  <>
    <Viewer 
    full
    sceneModePicker={true}
    navigationHelpButton={true}
    infoBox={true}
    animation={true}
    timeline={true}
    baseLayerPicker={true}
    geocoder={true}
    homeButton={true}
    fullscreenButton={true}
    >
      {
        currentStore &&
        <>
          <Entity position={position}  >
            <ModelGraphics uri={`${host}${currentStore}`}
            minimumPixelSize={128}
            show={true}
            maximumScale={20000}
            onReady={console.log("Ready")}
            />
          </Entity>
          
          <CameraFlyTo destination={cameraPosition} duration={2} />
        </>
      }
    </Viewer>
  </>
  )
}