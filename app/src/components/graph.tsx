import { application } from "@/lib/wailsjs/go/models";
import { flattenLists } from "@/utils/list-utils";
import { VStack } from "@chakra-ui/react";
import { chain } from "lodash";
import { FC, useCallback, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export const GraphView: FC<Omit<application.ListFile, "convertValues">> = (
  listFile,
) => {
  const nodes = listFile.lists
    .flatMap((lists) => flattenLists(lists))
    .map((v) => ({ ...v, color: "white" }));
  const links = nodes.map((listItem) => {
    const uidLength = listItem.uid.split("_").length;

    return {
      source: listItem.uid,
      target:
        uidLength <= 3
          ? "root"
          : chain(listItem.uid).split("_").initial().join("_").value(),
    };
  });

  // @ts-ignore
  const fgRef = useRef();

  return (
    nodes.length > 0 && (
      <VStack
        w="100%"
        css={{
          "&  canvas": { width: "100% !important", height: "100%  !important" },
          "&  div": { width: "100% !important", height: "100% !important" },
        }}
      >
        <ForceGraph2D
          d3Force="collision"
          d3VelocityDecay={0.3}
          // @ts-ignore
          ref={fgRef}
          graphData={{
            nodes: [{ id: -1, uid: "root", markdown: "" }, ...nodes],
            links,
          }}
          // @ts-ignore
          onEngineStop={() => fgRef.current.zoomToFit(100)}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.markdown;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px sans-serif`;

            const textWidth = ctx.measureText(label!).width;
            const backgroundDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2,
            ) as [number, number];

            // ctx.fillStyle = "rgba(0, 0, 0, 1)";
            // ctx.fillRect(
            //   node?.x! - backgroundDimensions[0] / 2,
            //   node?.y! - backgroundDimensions[1] / 2,
            //   ...backgroundDimensions,
            // );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.color;
            ctx.fillText(label!, node.x!, node.y!);

            node.__backgroundDimensions = backgroundDimensions as [
              number,
              number,
            ];
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            const backgroundDimensions = node.__backgroundDimensions as [
              number,
              number,
            ];
            backgroundDimensions &&
              ctx.fillRect(
                node.x! - backgroundDimensions[0] / 2,
                node.y! - backgroundDimensions[1] / 2,
                ...backgroundDimensions!,
              );
          }}
          linkResolution={10}
          nodeId="uid"
          // nodeAutoColorBy={(node) => {
          //   const splittedUid = node.uid.split("_");
          //   return splittedUid.length <= 3
          //     ? "root"
          //     : chain(splittedUid).initial().join("_").value();
          // }}
          linkAutoColorBy={({ source }) => {
            // const splittedUid = source.split("_");
            // return splittedUid.length <= 3
            //   ? "root"
            //   : chain(splittedUid).initial().join("_").value();
            return source.length.toString();
          }}
          // linkColor={"color"}
          linkCurveRotation={1}
          // linkCurvature={0.1}

          onNodeDragEnd={(node) => {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
          }}
          nodeRelSize={10}
          linkDirectionalParticles={0.6}
          linkDirectionalParticleWidth={2}
          linkWidth={0.4}
        />
      </VStack>
    )
  );
};
