
const buildScene = (scene, config) => {
  const { width, height } = config;
  return scene.map((col, colIndex) => {
    return col.map((row, rowIndex) => {
      // ensure everything is centered and equally spaced;
      const x = (width/scene.length) * ( colIndex + 1) - (width/scene.length)/2;
      const y = (height/col.length) * (rowIndex + 1) - (height/col.length)/2;
      return {...row, x, y};
    });
  });
};

const genStraightPath = (item, target) => {
  return `M${item.x} ${item.y} L${target.x} ${target.y}`;
};

const genStraightZigZagPath = (item, target) => {
  if (target.x === item.x ) {
    return `M${item.x} ${item.y} V${target.y}`
  }

  const middle = item.x + ((target.x - item.x) / 2);
  return `M${item.x} ${item.y} H${middle} V${target.y} H${target.x}`;
};

const genCurvedZigZagPath = (item, target, curveGutter) => {
  const middle = item.x + ((target.x - item.x) / 2);
  const turnStart = middle - curveGutter;

  if (target.x === item.x ) {
    return `M${item.x} ${item.y} V${target.y}`
  }

  if (item.y === target.y) {
    return `M${item.x} ${item.y} H${target.x}`
  }

  return `
     M${item.x} ${item.y}
     H${turnStart}
     C${middle} ${item.y}, ${middle} ${item.y}, ${middle} ${item.y > target.y ? item.y - curveGutter : item.y + curveGutter}
     V${item.y < target.y ? target.y - curveGutter : target.y + curveGutter }
     C${middle} ${target.y}, ${middle} ${target.y}, ${middle + curveGutter} ${ target.y}
     H${target.x}
   `;
}

const genPath = (item, target, config = {}) => {
  const curveGutter = config.curveGutter ?? 20;
  const pathKind = config.pathKind ?? 'straight';

  switch(pathKind) {
    case 'straight':
      return genStraightPath(item, target);
    case 'straight-zigzag':
      return genStraightZigZagPath(item, target);
    case 'curved-zigzag':
      return genCurvedZigZagPath(item, target, curveGutter);
  }
}

const buildLines = (scene, config) => {
  return scene.reduce((linesAcc, item) => {
    if (item.to) {
      const res = item.to.reduce((acc, to) => {
         const target = scene.find(itm => itm.id === to);
         if (target) {
          const path = genPath(item, target, config)
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
  const res =  scene.reduce((flat, col) => {
    return [...flat, ...col];
  });

  return res;
}

export { buildScene, buildLines, flatten };