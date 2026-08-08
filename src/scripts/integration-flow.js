const svgNamespace = "http://www.w3.org/2000/svg";

export const initializeIntegrationFlow = (stage) => {
  const svg = stage.querySelector("[data-integration-flow]");
  const lines = stage.querySelector("[data-integration-lines]");
  const core = stage.querySelector("[data-integration-core]");
  const cards = [...stage.querySelectorAll("[data-integration-card]")];

  if (!(svg instanceof SVGSVGElement) || !(lines instanceof SVGGElement) || !(core instanceof HTMLElement)) return;

  const desktopQuery = window.matchMedia("(min-width: 1024px)");
  const tabletQuery = window.matchMedia("(min-width: 640px)");
  let drawFrame = 0;

  const localRect = (element) => {
    let x = 0;
    let y = 0;
    let node = element;

    while (node && node !== stage) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
    }

    if (node === stage) return { x, y, width: element.offsetWidth, height: element.offsetHeight };

    const stageRect = stage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - stageRect.left,
      y: rect.top - stageRect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const createPath = (className, data, index) => {
    const path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("d", data);
    path.setAttribute("pathLength", "1");
    path.setAttribute("class", className);
    path.setAttribute("vector-effect", "non-scaling-stroke");
    path.style.setProperty("--flow-delay", String(index));
    return path;
  };

  const draw = () => {
    drawFrame = 0;
    const width = stage.offsetWidth;
    const height = stage.offsetHeight;
    if (!width || !height) return;

    const coreRect = localRect(core);
    const isDesktop = desktopQuery.matches;
    const isTablet = tabletQuery.matches;
    const selectedCards = cards.filter((card) => {
      const side = card.dataset.flowSide;
      const index = Number(card.dataset.flowIndex);
      if (isDesktop) return side === "source" ? index % 2 === 1 : index % 2 === 0;
      if (isTablet) return side === "source" ? index >= 4 : index < 4;
      return side === "source" ? index >= 6 : index < 2;
    });
    const measurements = selectedCards.map((card) => ({ card, rect: localRect(card) }));
    const fragment = document.createDocumentFragment();

    measurements.forEach(({ card, rect: cardRect }, index) => {
      let startX;
      let startY;
      let endX;
      let endY;
      let data;

      if (isDesktop) {
        const isLeft = card.dataset.flowSide === "source";
        endX = isLeft ? cardRect.x + cardRect.width : cardRect.x;
        endY = cardRect.y + cardRect.height / 2;
        startX = isLeft ? coreRect.x : coreRect.x + coreRect.width;
        startY = Math.min(coreRect.y + coreRect.height - 14, Math.max(coreRect.y + 14, endY));
        const direction = isLeft ? -1 : 1;
        const distance = Math.abs(endX - startX);
        const firstControlX = startX + direction * Math.max(18, distance * 0.48);
        const secondControlX = endX - direction * Math.max(12, distance * 0.28);
        data = `M ${startX} ${startY} C ${firstControlX} ${startY}, ${secondControlX} ${endY}, ${endX} ${endY}`;
      } else {
        const isAbove = card.dataset.flowSide === "source";
        endX = cardRect.x + cardRect.width / 2;
        endY = isAbove ? cardRect.y + cardRect.height : cardRect.y;
        startX = Math.min(coreRect.x + coreRect.width - 14, Math.max(coreRect.x + 14, endX));
        startY = isAbove ? coreRect.y : coreRect.y + coreRect.height;
        const direction = isAbove ? -1 : 1;
        const distance = Math.abs(endY - startY);
        const firstControlY = startY + direction * Math.max(18, distance * 0.48);
        const secondControlY = endY - direction * Math.max(12, distance * 0.28);
        data = `M ${startX} ${startY} C ${startX} ${firstControlY}, ${endX} ${secondControlY}, ${endX} ${endY}`;
      }

      const base = createPath("integration-flow__base", data, index);
      const pulse = createPath("integration-flow__pulse", data, index);
      pulse.dataset.flowSide = card.dataset.flowSide ?? "";
      pulse.dataset.flowIndex = card.dataset.flowIndex ?? "";
      pulse.dataset.flowStart = `${startX},${startY}`;
      pulse.dataset.flowEnd = `${endX},${endY}`;
      fragment.append(base, pulse);
    });

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    lines.replaceChildren(fragment);
  };

  const scheduleDraw = () => {
    if (drawFrame) cancelAnimationFrame(drawFrame);
    drawFrame = requestAnimationFrame(draw);
  };

  const resizeObserver = new ResizeObserver(scheduleDraw);
  resizeObserver.observe(stage);
  document.fonts?.ready.then(scheduleDraw);
  scheduleDraw();
};
