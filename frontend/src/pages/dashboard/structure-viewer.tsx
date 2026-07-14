import { useParams } from "react-router";
import { configuration } from "@/lib/configuration";
import { useEffect, createRef } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import "molstar/lib/mol-plugin-ui/skin/dark.scss";
import "molstar/lib/mol-plugin-ui/skin/light.scss";

declare global {
  interface Window {
    molstar?: PluginUIContext;
  }
}

const StructureViewerPage = () => {
  const { pdbFileName } = useParams();

  const parent = createRef<HTMLDivElement>();

  useEffect(() => {
    async function init() {
      window.molstar = await createPluginUI({
        target: parent.current as HTMLDivElement,
        render: renderReact18,
      });

      const data = await window.molstar.builders.data.download(
        {
          // url: "https://files.rcsb.org/download/3PTB.pdb",
          url: `${configuration.apiBaseUrl}/uploads/${pdbFileName}`,
        },
        { state: { isGhost: true } },
      );
      const trajectory =
        await window.molstar.builders.structure.parseTrajectory(data, "pdb");
      await window.molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default",
      );
    }
    init();
    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
    };
  }, [parent]);

  if (!pdbFileName) {
    return <p>No PDB file specified.</p>;
  }

  return (
    <div className="w-full h-full p-4 z-50">
      <div ref={parent} className="w-full h-full" />
    </div>
  );
};

export default StructureViewerPage;
