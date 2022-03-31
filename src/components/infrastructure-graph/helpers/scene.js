
const buildHorizontalScene = (scene, config) => {
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


const buildVerticalScene = (scene, config) => {
  const { width, height } = config;
  return scene.map((row, rowIndex) => {
    return row.map((col, colIndex) => {
      const x = ((width/row.length) * ( colIndex + 1)) - ((width/row.length)/2);
      const y = (height/scene.length) * (rowIndex + 1) - (height/scene.length)/2;
      return {...col, x, y};
    });
  });
}

const computePathY = ({ targetIndex, targetsLength, originsGap, y }) => {
  const length = (targetsLength-1) * originsGap;
  const halfLength = length / 2;

  console.log(targetIndex, targetsLength);
  return y + ((targetIndex) * originsGap - halfLength);
};


const genStraightPath = (item, target) => {
  return `M${item.x} ${item.y} L${target.x} ${target.y}`;
};

const genStraightZigZagPath = (item, target, config, context) => {
  if (target.x === item.x ) {
    return `M${item.x} ${item.y} V${target.y}`
  }

  const baseY = config.dispatchOrigins
    ? computePathY({
        targetIndex: context.targetIndex,
        targetsLength: context.targetsLength,
        originsGap: config.originsGap,
        y: item.y,
      })
    : item.y;

  const middle = item.x + ((target.x - item.x) / 2);
  return `M${item.x} ${baseY} H${middle} V${target.y} H${target.x}`;
};

const genCurvedZigZagPath = (item, target, config, context) => {
  const curveGutter = config.curveGutter;
  const middle = item.x + ((target.x - item.x) / 2);
  const turnStart = middle - curveGutter;

  if (target.x === item.x ) {
    return `M${item.x} ${item.y} V${target.y}`
  }

  const baseY = config.dispatchOrigins
  ? computePathY({
      targetIndex: context.targetIndex,
      targetsLength: context.targetsLength,
      originsGap: config.originsGap,
      y: item.y,
    })
  : item.y;

  if (baseY === target.y) {
    return `M${item.x} ${baseY} H${target.x}`
  }

  return `
     M${item.x} ${baseY}
     H${turnStart}
     C${middle} ${baseY}, ${middle} ${baseY}, ${middle} ${baseY > target.y ? baseY - curveGutter : baseY + curveGutter}
     V${baseY < target.y ? target.y - curveGutter : target.y + curveGutter }
     C${middle} ${target.y}, ${middle} ${target.y}, ${middle + curveGutter} ${ target.y}
     H${target.x}
   `;
}

const genPath = (item, target, config = {}, context) => {
  const pathKind = config.pathKind;

  switch(pathKind) {
    case 'straight':
      return genStraightPath(item, target);
    case 'straight-zigzag':
      return genStraightZigZagPath(item, target, config, context);
    case 'curved-zigzag':
      return genCurvedZigZagPath(item, target, config, context);
  }
}

const buildLines = (scene, config) => {
  return scene.reduce((linesAcc, item) => {
    console.log(item);
    if (item.to) {
      console.log(item);
      const targetsLength = item.to.length;
      const res = item.to.reduce((acc, to, toIndex) => {
         const target = scene.find(itm => itm.id === to);
         if (target) {
          const path = genPath(item, target, config, { targetsLength, targetIndex: toIndex });
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

export { buildHorizontalScene, buildVerticalScene, buildLines, flatten };