
const buildScene = (scene, config) => {
  const { width, height } = config;
  return scene.map((col, colIndex) => {
    return col.map((row, rowIndex) => {
      // ensure everything is centered and eually spaced;
      const x = (width/scene.length) * ( colIndex + 1) - (width/scene.length)/2;
      const y = (height/col.length) * (rowIndex + 1) - (height/col.length)/2;
      return {...row, x, y};
    });
  });
};
const TURN_GUTTER = 20;
const buildLines = scene => {
  return scene.reduce((linesAcc, item) => {
    if (item.to) {
      const res = item.to.reduce((acc, to) => {
         const target = scene.find(itm => itm.id === to);
         if (target) {
          //  return [...acc, { x1: item.x, x2: target.x, y1: item.y, y2: target.y, status: target.status }];
          const middle = target.x - item.x;
          const turnStart = middle - TURN_GUTTER;
          const turnEnd = middle + TURN_GUTTER;

          // return [...acc, { status: target.status, path: `M${item.x} ${item.y} H${middle} V${target.y} H${target.x}` } ];
          const path = item.y === target.y
           ? `M${item.x} ${item.y} H${target.x}`
           : `
              M${item.x} ${item.y}
              H${turnStart}
              C${middle} ${item.y}, ${middle} ${item.y}, ${middle} ${item.y > target.y ? item.y - TURN_GUTTER : item.y + TURN_GUTTER}
              V${item.y < target.y ? target.y - TURN_GUTTER : target.y + TURN_GUTTER }
              C${middle} ${target.y}, ${middle} ${target.y}, ${middle + TURN_GUTTER} ${ target.y}
              H${target.x}
            `;
          return [
            ...acc,
            { 
              status: target.status,
              'data-rely-to': item.id,
              path,
            },
          ]
         }
        return acc;
      }, []);
      return [...linesAcc, ...res];
    }
    return linesAcc;
  }, []);
}

const flatten = scene => {
  console.log(scene);
  return scene.reduce((flat, col) => {
    return [...flat, ...col];
  });
}

export { buildScene, buildLines, flatten };