package meta

type Model struct {
	Classes   []*ClassMeta
	Relations []*RelationMeta
	Packages  []*PackageMeta
}

func New(m *MetaContent, appId uint64) *Model {
	model := Model{
		Classes:   make([]*ClassMeta, len(m.Classes)),
		Relations: make([]*RelationMeta, len(m.Relations)),
		Packages:  make([]*PackageMeta, len(m.Packages)),
	}

	for i := range m.Packages {
		model.Packages[i] = &m.Packages[i]
	}

	for i := range m.Classes {
		model.Classes[i] = &m.Classes[i]
		if model.Classes[i].AppId == 0 {
			model.Classes[i].AppId = appId
		}
	}

	for i := range m.Relations {
		model.Relations[i] = &m.Relations[i]
		if model.Relations[i].AppId == 0 {
			model.Relations[i].AppId = appId
		}
	}
	return &model
}

func (m *Model) GetPackageByUuid(uuid string) *PackageMeta {
	for i := range m.Packages {
		if m.Packages[i].Uuid == uuid {
			return m.Packages[i]
		}
	}
	return nil
}

func (m *Model) GetClassByUuid(uuid string) *ClassMeta {
	for i := range m.Classes {
		if m.Classes[i].Uuid == uuid {
			return m.Classes[i]
		}
	}

	return nil
}

func (m *Model) GetAbstractClassByUuid(uuid string) *ClassMeta {
	for i := range m.Classes {
		if m.Classes[i].Uuid == uuid && m.Classes[i].StereoType == CLASSS_ABSTRACT {
			return m.Classes[i]
		}
	}
	return nil
}
